import express, { NextFunction, Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { db } from './server/db.ts';
import {
  AuthenticatedRequest,
  authenticateToken,
  comparePassword,
  generateToken,
  hashPassword,
  optionalAuth,
  requireAdmin,
  sanitizeObject,
  sanitizeString,
  validateEmail,
  validatePakistaniPhone,
} from './server/security.ts';
import { Order, Product } from './src/types.ts';

const app = express();
const PORT = 3000;

// Security & Parsing Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Security Headers Middleware
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// ==========================================
// API ROUTES
// ==========================================

// 1. Health Check
app.get('/api/health', async (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    store: 'Zikala Luxury Horology',
    database: db.isUsingPostgres() ? 'PostgreSQL (Managed Cloud DB)' : 'Durable Atomic Engine (Persistent)',
    timestamp: new Date().toISOString(),
  });
});

// 2. Authentication API

// POST /api/auth/register
app.post('/api/auth/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, phone, password } = req.body;

    const cleanName = sanitizeString(name);
    const cleanEmail = sanitizeString(email).toLowerCase();
    const cleanPhone = sanitizeString(phone);

    if (!cleanName || cleanName.length < 2) {
      res.status(400).json({ success: false, message: 'Please provide a valid full name (at least 2 characters).' });
      return;
    }

    if (!validateEmail(cleanEmail)) {
      res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
      return;
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      res.status(400).json({ success: false, message: 'Password must be at least 6 characters in length.' });
      return;
    }

    if (cleanPhone && !validatePakistaniPhone(cleanPhone)) {
      res.status(400).json({ success: false, message: 'Please provide a valid Pakistani mobile number (e.g. 03001234567).' });
      return;
    }

    // Check if user exists
    const existing = await db.findUserRecordByEmail(cleanEmail);
    if (existing) {
      res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
      return;
    }

    // Hash password with bcrypt
    const passwordHash = await hashPassword(password);

    const newUser = await db.addUser(
      {
        id: `usr-${Date.now()}`,
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        role: 'customer',
        addresses: [],
      },
      passwordHash
    );

    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: 'Your Zikala account has been created successfully.',
      user: newUser,
      token,
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = sanitizeString(email).toLowerCase();

    if (!cleanEmail || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required.' });
      return;
    }

    const userRecord = await db.findUserRecordByEmail(cleanEmail);
    if (!userRecord) {
      res.status(401).json({ success: false, message: 'Invalid credentials. Please verify your email and password.' });
      return;
    }

    // Verify bcrypt hash
    const isMatch = await comparePassword(password, userRecord.passwordHash);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid credentials. Please verify your email and password.' });
      return;
    }

    const { passwordHash: _, ...sanitizedUser } = userRecord;
    const token = generateToken(sanitizedUser);

    res.json({
      success: true,
      message: 'Authentication successful.',
      user: sanitizedUser,
      token,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me (Protected)
app.get('/api/auth/me', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const user = await db.findUserById(req.user!.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User account not found.' });
      return;
    }
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
});

// PUT /api/auth/profile (Protected)
app.put('/api/auth/profile', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { name, phone, addresses } = req.body;
    const updates: any = {};

    if (name) updates.name = sanitizeString(name);
    if (phone) {
      const cleanPhone = sanitizeString(phone);
      if (!validatePakistaniPhone(cleanPhone)) {
        res.status(400).json({ success: false, message: 'Please provide a valid Pakistani mobile number.' });
        return;
      }
      updates.phone = cleanPhone;
    }
    if (addresses && Array.isArray(addresses)) {
      updates.addresses = sanitizeObject(addresses);
    }

    const updated = await db.updateUser(req.user!.id, updates);
    if (!updated) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    res.json({ success: true, user: updated, message: 'Profile updated successfully.' });
  } catch (err) {
    next(err);
  }
});

// 3. Products API

// GET /api/products
app.get('/api/products', async (req: Request, res: Response, next: NextFunction) => {
  try {
    let products = await db.getProducts();
    const { category, search, minPrice, maxPrice, sort } = req.query;

    if (category && typeof category === 'string' && category !== 'All') {
      products = products.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }

    if (search && typeof search === 'string') {
      const q = sanitizeString(search).toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.categoryLabel.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q)
      );
    }

    if (minPrice && !isNaN(Number(minPrice))) {
      products = products.filter((p) => (p.discountPrice || p.price) >= Number(minPrice));
    }

    if (maxPrice && !isNaN(Number(maxPrice))) {
      products = products.filter((p) => (p.discountPrice || p.price) <= Number(maxPrice));
    }

    if (sort && typeof sort === 'string') {
      if (sort === 'price-asc') {
        products.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
      } else if (sort === 'price-desc') {
        products.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
      } else if (sort === 'popular') {
        products.sort((a, b) => b.reviewCount - a.reviewCount);
      } else if (sort === 'rating') {
        products.sort((a, b) => b.rating - a.rating);
      } else if (sort === 'newest') {
        products.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
      }
    }

    res.json({ success: true, count: products.length, products });
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:id
app.get('/api/products/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await db.getProductById(req.params.id);
    if (!product) {
      res.status(404).json({ success: false, message: 'Timepiece not found in catalog.' });
      return;
    }
    res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
});

// POST /api/products (Protected: Admin Only)
app.post('/api/products', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const cleanBody = sanitizeObject(req.body);
    const { name, category, price, quantity, shortDescription, description, images } = cleanBody;

    if (!name || !price || quantity === undefined) {
      res.status(400).json({ success: false, message: 'Name, price and quantity are required.' });
      return;
    }

    const numPrice = Number(price);
    const numQty = Number(quantity);

    if (isNaN(numPrice) || numPrice <= 0) {
      res.status(400).json({ success: false, message: 'Price must be a valid positive number.' });
      return;
    }

    const newProduct: Product = {
      id: cleanBody.id || `ZIK-${Date.now().toString().slice(-5)}`,
      name,
      category: category || 'Mens',
      categoryLabel: cleanBody.categoryLabel || `${category || 'Mens'} Watches`,
      price: numPrice,
      discountPrice: cleanBody.discountPrice ? Number(cleanBody.discountPrice) : undefined,
      description: description || '',
      shortDescription: shortDescription || '',
      images: Array.isArray(images) && images.length > 0 ? images : ['https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1000&q=80'],
      colors: cleanBody.colors || [{ name: 'Classic Gold', hex: '#D4AF37' }],
      quantity: numQty,
      stockStatus: numQty > 0 ? (numQty <= 3 ? 'Low Stock' : 'In Stock') : 'Out of Stock',
      rating: 5.0,
      reviewCount: 0,
      specifications: cleanBody.specifications || {
        caseDiameter: '41 mm',
        caseThickness: '11 mm',
        glass: 'Scratch-Proof Sapphire Crystal',
        movement: 'Precision Automatic Calibre',
        waterResistance: '50m (5 ATM)',
        strapMaterial: 'Solid 316L Stainless Steel',
        caseMaterial: '316L Surgical Steel',
        warranty: '2 Years Zikala International Warranty',
      },
      features: cleanBody.features || ['Anti-Reflective Sapphire', '316L Stainless Steel', 'Swiss-Grade Precision'],
      reviews: [],
    };

    const created = await db.addProduct(newProduct);
    res.status(201).json({ success: true, product: created, message: 'Timepiece published successfully.' });
  } catch (err) {
    next(err);
  }
});

// PUT /api/products/:id (Protected: Admin Only)
app.put('/api/products/:id', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const cleanUpdates = sanitizeObject(req.body);
    if (cleanUpdates.price) cleanUpdates.price = Number(cleanUpdates.price);
    if (cleanUpdates.discountPrice) cleanUpdates.discountPrice = Number(cleanUpdates.discountPrice);
    if (cleanUpdates.quantity !== undefined) cleanUpdates.quantity = Number(cleanUpdates.quantity);

    const updated = await db.updateProduct(req.params.id, cleanUpdates);
    if (!updated) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }
    res.json({ success: true, product: updated, message: 'Timepiece updated successfully.' });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/products/:id (Protected: Admin Only)
app.delete('/api/products/:id', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const ok = await db.deleteProduct(req.params.id);
    if (!ok) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }
    res.json({ success: true, message: 'Timepiece removed from catalog.' });
  } catch (err) {
    next(err);
  }
});

// POST /api/products/:id/reviews (Public customer reviews with sanitization)
app.post('/api/products/:id/reviews', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cleanUserName = sanitizeString(req.body.userName);
    const cleanCity = sanitizeString(req.body.city);
    const cleanComment = sanitizeString(req.body.comment);
    const numRating = Number(req.body.rating);

    if (!cleanUserName || !cleanComment || isNaN(numRating) || numRating < 1 || numRating > 5) {
      res.status(400).json({ success: false, message: 'Please provide your name, a rating (1-5), and your review comments.' });
      return;
    }

    const review = {
      id: `rev-${Date.now()}`,
      userName: cleanUserName,
      city: cleanCity || 'Pakistan',
      rating: numRating,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      comment: cleanComment,
      verifiedPurchase: true,
    };

    const updatedProduct = await db.addProductReview(req.params.id, review);
    if (!updatedProduct) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }

    res.status(201).json({ success: true, review, product: updatedProduct });
  } catch (err) {
    next(err);
  }
});

// 4. Orders API

// GET /api/orders (Protected: Admin gets all, customer gets own; fallback with email filter)
app.get('/api/orders', optionalAuth, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { email } = req.query;

    if (req.user && req.user.role === 'admin') {
      const orders = await db.getOrders();
      res.json({ success: true, count: orders.length, orders });
      return;
    }

    const filterEmail = req.user ? req.user.email : (typeof email === 'string' ? sanitizeString(email) : undefined);
    if (!filterEmail) {
      res.json({ success: true, count: 0, orders: [] });
      return;
    }

    const orders = await db.getOrders(filterEmail);
    res.json({ success: true, count: orders.length, orders });
  } catch (err) {
    next(err);
  }
});

// GET /api/orders/:id
app.get('/api/orders/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await db.getOrderById(req.params.id);
    if (!order) {
      res.status(404).json({ success: false, message: 'Order not found.' });
      return;
    }
    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
});

// GET /api/orders/track/:query
app.get('/api/orders/track/:query', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = sanitizeString(req.params.query).toLowerCase();
    const allOrders = await db.getOrders();
    const order = allOrders.find(
      (o) => o.id.toLowerCase() === query || o.trackingNumber.toLowerCase() === query
    );
    if (!order) {
      res.status(404).json({
        success: false,
        message: `No order found matching "${req.params.query}". Please check your Reference ID or TCS Tracking Number.`,
      });
      return;
    }
    res.json({ success: true, order });
  } catch (err) {
    next(err);
  }
});

// POST /api/orders (Create order with server-side price recalculation & anti-tampering)
app.post('/api/orders', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { customer, items, paymentMethod, paymentTransactionId, paymentProofNote, couponCode } = req.body;

    if (!customer || !customer.fullName || !customer.phone || !customer.address || !customer.city) {
      res.status(400).json({ success: false, message: 'Complete delivery address, city, and mobile number are required.' });
      return;
    }

    const cleanFullName = sanitizeString(customer.fullName);
    const cleanPhone = sanitizeString(customer.phone);
    const cleanEmail = sanitizeString(customer.email);
    const cleanAddress = sanitizeString(customer.address);
    const cleanCity = sanitizeString(customer.city);
    const cleanProvince = sanitizeString(customer.province || 'Sindh');
    const cleanPostal = sanitizeString(customer.postalCode || '');
    const cleanNotes = customer.orderNotes ? sanitizeString(customer.orderNotes) : undefined;

    if (!validatePakistaniPhone(cleanPhone)) {
      res.status(400).json({ success: false, message: 'Please provide a valid Pakistani mobile number (e.g. 03001234567).' });
      return;
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ success: false, message: 'Order must contain at least one timepiece.' });
      return;
    }

    // SERVER-SIDE PRICE & STOCK VALIDATION (Prevents client-side price tampering)
    const verifiedItems: any[] = [];
    let calculatedSubtotal = 0;

    for (const item of items) {
      const product = await db.getProductById(item.productId);
      if (!product) {
        res.status(400).json({ success: false, message: `Timepiece "${item.productName || item.productId}" is no longer available.` });
        return;
      }
      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
      const actualUnitPrice = product.discountPrice || product.price;
      const itemSubtotal = actualUnitPrice * qty;
      calculatedSubtotal += itemSubtotal;

      verifiedItems.push({
        productId: product.id,
        productName: product.name,
        image: product.images[0],
        color: sanitizeString(item.color || 'Standard'),
        quantity: qty,
        price: actualUnitPrice,
        subtotal: itemSubtotal,
      });
    }

    const settings = await db.getSettings();
    const shippingCharges = calculatedSubtotal >= settings.freeShippingThreshold ? 0 : settings.shippingFee;

    let discount = 0;
    const cleanCoupon = couponCode ? sanitizeString(couponCode).toUpperCase() : '';
    if (cleanCoupon === 'ZIKALA10') {
      discount = Math.round(calculatedSubtotal * 0.1);
    }

    const total = Math.max(0, calculatedSubtotal + shippingCharges - discount);

    const orderNum = `ZIK-${Math.floor(10000 + Math.random() * 90000)}`;
    const tcsTracking = `TCS-${Math.floor(10000000 + Math.random() * 90000000)}`;

    const validMethods = ['cod', 'easypaisa', 'jazzcash', 'bank_transfer'];
    const safeMethod = validMethods.includes(paymentMethod) ? paymentMethod : 'cod';

    let initialPaymentStatus: Order['paymentStatus'] = 'Unpaid (COD)';
    if (safeMethod !== 'cod') {
      initialPaymentStatus = 'Pending Verification';
    }

    const order: Order = {
      id: orderNum,
      createdAt: new Date().toISOString(),
      customer: {
        fullName: cleanFullName,
        phone: cleanPhone,
        email: cleanEmail,
        address: cleanAddress,
        city: cleanCity,
        province: cleanProvince,
        postalCode: cleanPostal,
        orderNotes: cleanNotes,
      },
      items: verifiedItems,
      subtotal: calculatedSubtotal,
      shippingCharges,
      discount,
      couponCode: cleanCoupon || undefined,
      total,
      paymentMethod: safeMethod,
      paymentStatus: initialPaymentStatus,
      paymentTransactionId: paymentTransactionId ? sanitizeString(paymentTransactionId) : undefined,
      paymentProofNote: paymentProofNote ? sanitizeString(paymentProofNote) : undefined,
      orderStatus: 'Order Placed',
      estimatedDelivery: '2 - 3 Business Days via TCS Express',
      trackingNumber: tcsTracking,
      timeline: [
        {
          status: 'Order Placed',
          timestamp: new Date().toLocaleString('en-PK'),
          description: `Order successfully booked with ${safeMethod.toUpperCase()} payment method.`,
        },
      ],
    };

    const created = await db.addOrder(order);
    res.status(201).json({ success: true, order: created, message: 'Order booked successfully.' });
  } catch (err) {
    next(err);
  }
});

// PUT /api/orders/:id/status (Protected: Admin Only)
app.put('/api/orders/:id/status', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    if (!orderStatus) {
      res.status(400).json({ success: false, message: 'Order fulfillment status is required.' });
      return;
    }

    const updated = await db.updateOrderStatus(req.params.id, orderStatus, paymentStatus);
    if (!updated) {
      res.status(404).json({ success: false, message: 'Order not found.' });
      return;
    }
    res.json({ success: true, order: updated, message: 'Order status updated successfully.' });
  } catch (err) {
    next(err);
  }
});

// 5. Store Settings API

// GET /api/settings
app.get('/api/settings', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = await db.getSettings();
    res.json({ success: true, settings });
  } catch (err) {
    next(err);
  }
});

// PUT /api/settings (Protected: Admin Only)
app.put('/api/settings', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const sanitized = sanitizeObject(req.body);
    const updated = await db.updateSettings(sanitized);
    res.json({ success: true, settings: updated, message: 'Store settings saved.' });
  } catch (err) {
    next(err);
  }
});

// 6. Admin Analytics API (Protected: Admin Only)
app.get('/api/stats', authenticateToken, requireAdmin, async (_req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const orders = await db.getOrders();
    const products = await db.getProducts();
    const users = await db.getUsers();

    const totalSales = orders
      .filter((o) => o.orderStatus !== 'Cancelled')
      .reduce((sum, o) => sum + o.total, 0);

    const pendingOrders = orders.filter(
      (o) => o.orderStatus === 'Order Placed' || o.orderStatus === 'Confirmed'
    ).length;

    const lowStockProducts = products.filter((p) => p.quantity <= 3).length;

    res.json({
      success: true,
      stats: {
        totalSales,
        totalOrders: orders.length,
        pendingOrders,
        totalProducts: products.length,
        totalCustomers: users.length,
        lowStockProducts,
      },
      recentOrders: orders.slice(0, 5),
    });
  } catch (err) {
    next(err);
  }
});

// ==========================================
// SECURE GLOBAL ERROR HANDLER
// ==========================================
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[Server Error]', err.message || err);
  const isProd = process.env.NODE_ENV === 'production';

  res.status(err.status || 500).json({
    success: false,
    message: isProd ? 'An internal error occurred. Please try again later.' : err.message || 'Internal Server Error',
    error: isProd ? undefined : err.stack,
  });
});

// ==========================================
// VITE SPA INTEGRATION & SERVER STARTUP
// ==========================================
async function startServer() {
  // Initialize Database
  await db.init();

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Zikala Backend] Production server active on http://0.0.0.0:${PORT}`);
  });
}

startServer();
