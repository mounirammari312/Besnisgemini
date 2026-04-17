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
