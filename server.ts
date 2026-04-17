import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import * as z from 'zod';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase Admin Client
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());

  // Auth Middleware
  const authenticate = async (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });

    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) return res.status(401).json({ error: 'Invalid token' });
    req.user = user;
    next();
  };

  // API Routes (Linking all tasks to Database)
  
  // 1. Health & Config
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', platform: 'Businfo', db: 'Supabase' });
  });

  // 2. Products (GET /api/products)
  app.get('/api/products', async (req, res) => {
    const { data, error } = await supabaseAdmin.from('products').select('*, suppliers(*)');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  // 3. Products Details (GET /api/products/:id)
  app.get('/api/products/:id', async (req, res) => {
    const { data, error } = await supabaseAdmin.from('products').select('*, suppliers(*)').eq('id', req.params.id).single();
    if (error) return res.status(error.code === 'PGRST116' ? 404 : 500).json({ error: error.message });
    res.json(data);
  });

  // 4. Supplier Registration / Profile Sync
  app.post('/api/suppliers/register', authenticate, async (req: any, res) => {
    const schema = z.object({
      name: z.string().min(2),
      company_name: z.string().optional(),
    });

    const validated = schema.parse(req.body);
    const { data, error } = await supabaseAdmin.from('suppliers').upsert({
      id: req.user.id,
      name: validated.name,
      joined_year: new Date().getFullYear().toString(),
    }).select().single();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  // 5. Quote Management
  app.post('/api/quotes', authenticate, async (req: any, res) => {
    const { product_id, supplier_id, quantity, message } = req.body;
    const { data, error } = await supabaseAdmin.from('quotes').insert({
      buyer_id: req.user.id,
      product_id,
      supplier_id,
      quantity,
      message,
      status: 'pending'
    }).select().single();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  // 6. Get Quotes - Buyer
  app.get('/api/quotes/buyer', authenticate, async (req: any, res) => {
    const { data, error } = await supabaseAdmin
      .from('quotes')
      .select('*, products(*), suppliers(*)')
      .eq('buyer_id', req.user.id);

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  // 7. Get Quotes - Supplier
  app.get('/api/quotes/supplier', authenticate, async (req: any, res) => {
    const { data, error } = await supabaseAdmin
      .from('quotes')
      .select('*, products(*), profiles(*)')
      .eq('supplier_id', req.user.id);

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  // 8. Categories List
  app.get('/api/categories', async (req, res) => {
    const { data, error } = await supabaseAdmin.from('categories').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  // 9. Chats List
  app.get('/api/chats', authenticate, async (req: any, res) => {
    const { data, error } = await supabaseAdmin
      .from('chats')
      .select('*, profiles:buyer_id(*), suppliers:supplier_id(*)')
      .or(`buyer_id.eq.${req.user.id},supplier_id.eq.${req.user.id}`);

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  // 10. Messages in Chat
  app.get('/api/messages/:chatId', authenticate, async (req: any, res) => {
    const { data, error } = await supabaseAdmin
      .from('messages')
      .select('*')
      .eq('chat_id', req.params.chatId)
      .order('created_at', { ascending: true });

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  // 11. Send Message
  app.post('/api/messages', authenticate, async (req: any, res) => {
    const schema = z.object({
      chat_id: z.string().uuid(),
      content: z.string().min(1),
    });

    try {
      const validated = schema.parse(req.body);
      const { data, error } = await supabaseAdmin.from('messages').insert({
        chat_id: validated.chat_id,
        sender_id: req.user.id,
        content: validated.content
      }).select().single();

      if (error) return res.status(500).json({ error: error.message });
      
      // Update chat last message
      await supabaseAdmin.from('chats').update({ 
        last_message: validated.content,
        updated_at: new Date().toISOString()
      }).eq('id', validated.chat_id);

      res.json(data);
    } catch (e: any) {
      res.status(400).json({ error: e.errors });
    }
  });

  // 12. Admin Board Statistics (Existing - but ensure it's robust)
  app.get('/api/admin/stats', authenticate, async (req: any, res) => {
    const { data: profile } = await supabaseAdmin.from('profiles').select('role').eq('id', req.user.id).single();
    if (profile?.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

    const [users, suppliers, products, quotes] = await Promise.all([
      supabaseAdmin.from('profiles').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('suppliers').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('products').select('id', { count: 'exact', head: true }),
      supabaseAdmin.from('quotes').select('id', { count: 'exact', head: true }),
    ]);

    res.json({
      totalUsers: users.count,
      totalSuppliers: suppliers.count,
      totalProducts: products.count,
      totalQuotes: quotes.count
    });
  });

  // 13. Create Product (Supplier)
  app.post('/api/products', authenticate, async (req: any, res) => {
    const schema = z.object({
      name_ar: z.string(),
      name_fr: z.string(),
      price: z.number(),
      category_id: z.string(),
      main_image: z.string().url(),
    });

    try {
      const validated = schema.parse(req.body);
      const { data, error } = await supabaseAdmin.from('products').insert({
        ...validated,
        supplier_id: req.user.id
      }).select().single();
      if (error) throw error;
      res.json(data);
    } catch (e: any) {
      res.status(400).json({ error: e.message || e.errors });
    }
  });

  // 14. Update Product (Supplier)
  app.put('/api/products/:id', authenticate, async (req: any, res) => {
    const { data: product } = await supabaseAdmin.from('products').select('supplier_id').eq('id', req.params.id).single();
    if (product?.supplier_id !== req.user.id) return res.status(403).json({ error: 'Not owner' });

    const { data, error } = await supabaseAdmin.from('products').update(req.body).eq('id', req.params.id).select().single();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  // 15. Delete Product (Supplier)
  app.delete('/api/products/:id', authenticate, async (req: any, res) => {
    const { data: product } = await supabaseAdmin.from('products').select('supplier_id').eq('id', req.params.id).single();
    if (product?.supplier_id !== req.user.id) return res.status(403).json({ error: 'Not owner' });

    const { error } = await supabaseAdmin.from('products').delete().eq('id', req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  });

  // 16. Update Quote Status (Supplier/Buyer)
  app.patch('/api/quotes/:id/status', authenticate, async (req: any, res) => {
    const { status } = req.body;
    const { error } = await supabaseAdmin.from('quotes').update({ status }).eq('id', req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  });

  // 17. List Suppliers
  app.get('/api/suppliers', async (req, res) => {
    const { data, error } = await supabaseAdmin.from('suppliers').select('*');
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  // 18. Get Supplier Profile
  app.get('/api/suppliers/:id', async (req, res) => {
    const { data, error } = await supabaseAdmin.from('suppliers').select('*, products(*)').eq('id', req.params.id).single();
    if (error) return res.status(404).json({ error: 'Supplier not found' });
    res.json(data);
  });

  // 19. Update User Role (Admin)
  app.patch('/api/admin/users/:id/role', authenticate, async (req: any, res) => {
    const { role } = req.body;
    const { data: admin } = await supabaseAdmin.from('profiles').select('role').eq('id', req.user.id).single();
    if (admin?.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

    const { error } = await supabaseAdmin.from('profiles').update({ role }).eq('id', req.params.id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  });

  // 20. Search Suggestions
  app.get('/api/search/suggestions', async (req, res) => {
    const { q } = req.query;
    const { data, error } = await supabaseAdmin.from('products').select('name_ar, name_fr').ilike('name_fr', `%${q}%`).limit(5);
    res.json(data || []);
  });

  // 21. User Profile Update
  app.put('/api/profiles/me', authenticate, async (req: any, res) => {
    const { error } = await supabaseAdmin.from('profiles').update(req.body).eq('id', req.user.id);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true });
  });

  // 22. List Chats for User
  app.get('/api/me/chats', authenticate, async (req: any, res) => {
    const { data, error } = await supabaseAdmin.from('chats').select('*, profiles!buyer_id(*), suppliers(*)').or(`buyer_id.eq.${req.user.id},supplier_id.eq.${req.user.id}`);
    res.json(data || []);
  });

  // 23. Initialize Chat (Buyer -> Supplier)
  app.post('/api/chats/init', authenticate, async (req: any, res) => {
    const { supplier_id } = req.body;
    const { data, error } = await supabaseAdmin.from('chats').upsert({
      buyer_id: req.user.id,
      supplier_id: supplier_id,
    }, { onConflict: 'buyer_id,supplier_id' }).select().single();
    
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  });

  // 24. Admin: List All Users
  app.get('/api/admin/users', authenticate, async (req: any, res) => {
    const { data: admin } = await supabaseAdmin.from('profiles').select('role').eq('id', req.user.id).single();
    if (admin?.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

    const { data, error } = await supabaseAdmin.from('profiles').select('*');
    res.json(data || []);
  });

  // 25. Supplier Dashboard Meta
  app.get('/api/supplier/dashboard', authenticate, async (req: any, res) => {
    const [products, quotes] = await Promise.all([
      supabaseAdmin.from('products').select('id', { count: 'exact' }).eq('supplier_id', req.user.id),
      supabaseAdmin.from('quotes').select('id', { count: 'exact' }).eq('supplier_id', req.user.id),
    ]);
    res.json({ productsCount: products.count, quotesCount: quotes.count });
  });

  // 26. Admin Trace Logs (Mock for completeness)
  app.get('/api/admin/logs', authenticate, async (req: any, res) => {
    res.json({ logs: ['System healthy', 'New user registered', 'Product updated'] });
  });

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
