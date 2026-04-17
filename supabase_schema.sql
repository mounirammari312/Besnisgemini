-- Businfo B2B Platform Schema

-- 1. Profiles (Buyers/Suppliers/Admins)
create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  display_name text,
  role text check (role in ('buyer', 'supplier', 'admin')) not null default 'buyer',
  photo_url text,
  phone_number text,
  company_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Suppliers Public Storefront
create table if not exists suppliers (
  id uuid references profiles(id) on delete cascade primary key,
  name text not null,
  description_ar text,
  description_fr text,
  logo_url text,
  cover_url text,
  location text,
  rating float default 0,
  reviews_count integer default 0,
  badges text[],
  joined_year text default extract(year from now())::text
);

-- 3. Categories
create table if not exists categories (
  id text primary key,
  name_ar text not null,
  name_fr text not null,
  icon_name text,
  parent_id text references categories(id)
);

-- 4. Products
create table if not exists products (
  id uuid default gen_random_uuid() primary key,
  supplier_id uuid references suppliers(id) on delete cascade not null,
  category_id text references categories(id),
  name_ar text not null,
  name_fr text not null,
  price numeric(12, 2) not null,
  currency text default 'DZD' not null,
  main_image text,
  gallery text[],
  specs jsonb default '{}'::jsonb,
  rating float default 0,
  reviews_count integer default 0,
  is_verified boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Quote Requests
create table if not exists quotes (
  id uuid default gen_random_uuid() primary key,
  buyer_id uuid references profiles(id) not null,
  supplier_id uuid references suppliers(id) not null,
  product_id uuid references products(id) not null,
  quantity integer not null check (quantity > 0),
  message text,
  status text check (status in ('pending', 'responded', 'rejected', 'accepted')) default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Messages & Chats
create table if not exists chats (
  id uuid default gen_random_uuid() primary key,
  buyer_id uuid references profiles(id) not null,
  supplier_id uuid references suppliers(id) not null,
  last_message text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists messages (
  id uuid default gen_random_uuid() primary key,
  chat_id uuid references chats(id) on delete cascade not null,
  sender_id uuid references profiles(id) not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Reviews
create table if not exists reviews (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references products(id) on delete cascade not null,
  buyer_id uuid references profiles(id) not null,
  rating integer check (rating >= 1 and rating <= 5) not null,
  comment text,
  supplier_response text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. Product Variations
create table if not exists product_variations (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references products(id) on delete cascade not null,
  name_ar text not null,
  name_fr text not null,
  sku text,
  stock integer default 0,
  price_adjustment numeric(12, 2) default 0
);

-- 9. Orders & Commerce
create table if not exists orders (
  id uuid default gen_random_uuid() primary key,
  buyer_id uuid references profiles(id) not null,
  supplier_id uuid references suppliers(id) not null,
  status text check (status in ('pending', 'processing', 'shipped', 'delivered', 'cancelled')) default 'pending',
  total_amount numeric(12, 2) not null,
  currency text default 'DZD',
  shipping_address text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references orders(id) on delete cascade not null,
  product_id uuid references products(id) not null,
  variation_id uuid references product_variations(id),
  quantity integer not null,
  unit_price numeric(12, 2) not null
);

-- 10. Revenue System (Ads & Badges)
create table if not exists ad_types (
  id text primary key,
  name text not null,
  price_per_day numeric(10, 2) not null,
  description text
);

create table if not exists ad_requests (
  id uuid default gen_random_uuid() primary key,
  supplier_id uuid references suppliers(id) not null,
  ad_type_id text references ad_types(id) not null,
  status text check (status in ('pending', 'active', 'expired', 'rejected')) default 'pending',
  start_date date,
  end_date date,
  payment_status text default 'unpaid',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists badge_types (
  id text primary key,
  name_ar text not null,
  name_fr text not null,
  icon_name text,
  price numeric(10, 2) not null
);

create table if not exists badge_requests (
  id uuid default gen_random_uuid() primary key,
  supplier_id uuid references suppliers(id) not null,
  badge_type_id text references badge_types(id) not null,
  status text check (status in ('pending', 'approved', 'rejected')) default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists supplier_badges (
  supplier_id uuid references suppliers(id) on delete cascade not null,
  badge_type_id text references badge_types(id) on delete cascade not null,
  granted_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (supplier_id, badge_type_id)
);

-- 11. Social & Engagement
create table if not exists favorites (
  user_id uuid references profiles(id) on delete cascade not null,
  product_id uuid references products(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, product_id)
);

-- 12. Real-time Notifications
create table if not exists notifications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  title_ar text not null,
  title_fr text not null,
  content_ar text,
  content_fr text,
  type text, -- 'order', 'quote', 'message', 'badge'
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS (Row Level Security) - Prototype
-- Enable RLS
alter table profiles enable row level security;
alter table suppliers enable row level security;
alter table products enable row level security;
alter table quotes enable row level security;
alter table chats enable row level security;
alter table messages enable row level security;
alter table reviews enable row level security;

-- Profiles: Own profile access
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Product: Public read
create policy "Products are public" on products for select using (true);
create policy "Suppliers can manage own products" on products for all using (auth.uid() = supplier_id);

-- Reviews: Public read
create policy "Reviews are public" on reviews for select using (true);
create policy "Buyers can create reviews" on reviews for insert with check (auth.uid() = buyer_id);
create policy "Suppliers can respond to reviews" on reviews for update using (
  exists (
    select 1 from products 
    where products.id = reviews.product_id 
    and products.supplier_id = auth.uid()
  )
);

-- Product Variations RLS
alter table product_variations enable row level security;
create policy "Variations: Public read" on product_variations for select using (true);
create policy "Variations: Supplier manage" on product_variations for all using (
  exists (
    select 1 from products where products.id = product_variations.product_id and products.supplier_id = auth.uid()
  )
);

-- Orders RLS
alter table orders enable row level security;
create policy "Orders: Users view own" on orders for select using (auth.uid() = buyer_id or auth.uid() = supplier_id);
create policy "Buyers: Create orders" on orders for insert with check (auth.uid() = buyer_id);

-- Order Items RLS
alter table order_items enable row level security;
create policy "Order Items: Restricted access" on order_items for select using (
  exists (select 1 from orders where orders.id = order_items.order_id and (orders.buyer_id = auth.uid() or orders.supplier_id = auth.uid()))
);

-- Ads & Badges RLS
alter table ad_types enable row level security;
create policy "Ads: Public read" on ad_types for select using (true);

alter table ad_requests enable row level security;
create policy "Ad Requests: Supplier view own" on ad_requests for select using (auth.uid() = supplier_id);
create policy "Suppliers: Request ads" on ad_requests for insert with check (auth.uid() = supplier_id);

alter table badge_types enable row level security;
create policy "Badge Types: Public read" on badge_types for select using (true);

alter table badge_requests enable row level security;
create policy "Badge Requests: Supplier manage" on badge_requests for all using (auth.uid() = supplier_id);

alter table supplier_badges enable row level security;
create policy "Supplier Badges: Public read" on supplier_badges for select using (true);

-- Favorites RLS
alter table favorites enable row level security;
create policy "Favorites: Own access" on favorites for all using (auth.uid() = user_id);

-- Notifications RLS
alter table notifications enable row level security;
create policy "Notifications: Own access" on notifications for all using (auth.uid() = user_id);
