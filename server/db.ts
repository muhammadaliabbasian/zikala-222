import fs from 'fs';
import path from 'path';
import pg from 'pg';
import { INITIAL_PRODUCTS } from '../src/data/products.ts';
import { Order, Product, StoreSettings, User } from '../src/types.ts';
import { hashPassword } from './security.ts';

const { Pool } = pg;

export interface UserRecord extends User {
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
}

export interface DatabaseSchema {
  products: Product[];
  orders: Order[];
  users: UserRecord[];
  settings: StoreSettings;
}

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'db.json');
const DB_TEMP_FILE = path.join(DB_DIR, 'db.json.tmp');

const DEFAULT_SETTINGS: StoreSettings = {
  shippingFee: 450,
  freeShippingThreshold: 25000,
  codAvailable: true,
  easypaisaAccount: {
    title: 'ZIKALA LUXURY (PVT) LTD',
    number: '0300-8452910',
  },
  jazzcashAccount: {
    title: 'ZIKALA WATCHES OFFICIAL',
    number: '0321-4920184',
  },
  bankAccount: {
    bankName: 'Meezan Bank Limited (Islamic Banking)',
    title: 'ZIKALA HOROLOGY PAKISTAN',
    iban: 'PK42MEZN0001090284918290',
    accountNumber: '0109-0284918290',
  },
};

const INITIAL_ORDERS: Order[] = [
  {
    id: 'ZIK-94821',
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    customer: {
      fullName: 'Shahzaib Ahmed',
      phone: '0321-9876543',
      email: 'shahzaib@example.com',
      address: 'House #42, Street 15, Sector F-7/2',
      city: 'Islamabad',
      province: 'Islamabad Capital Territory',
      postalCode: '44000',
      orderNotes: 'Please deliver after 2 PM if possible.',
    },
    items: [
      {
        productId: 'ZIK-M01',
        productName: 'Zikala Royal Obsidian Heritage',
        image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1000&q=80',
        color: 'Obsidian Black',
        quantity: 1,
        price: 28900,
        subtotal: 28900,
      },
    ],
    subtotal: 28900,
    shippingCharges: 0,
    discount: 0,
    total: 28900,
    paymentMethod: 'cod',
    paymentStatus: 'Unpaid (COD)',
    orderStatus: 'Dispatched',
    estimatedDelivery: '2 - 3 Business Days via TCS Express',
    trackingNumber: 'TCS-99482014',
    timeline: [
      {
        status: 'Order Placed',
        timestamp: new Date(Date.now() - 36 * 3600 * 1000).toLocaleString('en-PK'),
        description: 'Order received and registered in Zikala fulfillment queue.',
      },
      {
        status: 'Confirmed',
        timestamp: new Date(Date.now() - 28 * 3600 * 1000).toLocaleString('en-PK'),
        description: 'Order verified by Zikala Customer Concierge.',
      },
      {
        status: 'Dispatched',
        timestamp: new Date(Date.now() - 12 * 3600 * 1000).toLocaleString('en-PK'),
        description: 'Dispatched via TCS Secure Vault Express from Karachi Boutique Hub.',
      },
    ],
  },
  {
    id: 'ZIK-82104',
    createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
    customer: {
      fullName: 'Dr. Mahnoor Javed',
      phone: '0333-5192847',
      email: 'mahnoor@example.com',
      address: 'Apartment 7B, Creek Vistas, Phase 8 DHA',
      city: 'Karachi',
      province: 'Sindh',
      postalCode: '75500',
    },
    items: [
      {
        productId: 'ZIK-W02',
        productName: 'Zikala Seraphina Emerald Grace',
        image: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=1000&q=80',
        color: 'Malachite Green & Gold',
        quantity: 1,
        price: 32000,
        subtotal: 32000,
      },
    ],
    subtotal: 32000,
    shippingCharges: 0,
    discount: 0,
    total: 32000,
    paymentMethod: 'bank_transfer',
    paymentStatus: 'Verified & Paid',
    paymentTransactionId: 'MEZN-TX-84920481',
    orderStatus: 'Delivered',
    estimatedDelivery: 'Delivered',
    trackingNumber: 'TCS-88194021',
    timeline: [
      {
        status: 'Order Placed',
        timestamp: new Date(Date.now() - 5 * 24 * 3600 * 1000).toLocaleString('en-PK'),
        description: 'Order placed via Bank Transfer.',
      },
      {
        status: 'Confirmed',
        timestamp: new Date(Date.now() - 4 * 24 * 3600 * 1000).toLocaleString('en-PK'),
        description: 'Meezan Bank wire transfer verified & confirmed.',
      },
      {
        status: 'Dispatched',
        timestamp: new Date(Date.now() - 3 * 24 * 3600 * 1000).toLocaleString('en-PK'),
        description: 'Handed over to courier.',
      },
      {
        status: 'Delivered',
        timestamp: new Date(Date.now() - 2 * 24 * 3600 * 1000).toLocaleString('en-PK'),
        description: 'Delivered safely to recipient at DHA Karachi.',
      },
    ],
  },
];

class ManagedDatabase {
  private pgPool: pg.Pool | null = null;
  private isPostgres = false;
  private fileData: DatabaseSchema;
  private initialized = false;

  constructor() {
    this.fileData = {
      products: INITIAL_PRODUCTS,
      orders: INITIAL_ORDERS,
      users: [],
      settings: DEFAULT_SETTINGS,
    };
  }

  /**
   * Initialize the database connection (PostgreSQL if DATABASE_URL provided, else atomic file store).
   */
  public async init(): Promise<void> {
    if (this.initialized) return;

    const dbUrl = process.env.DATABASE_URL;
    if (dbUrl) {
      try {
        console.log('[Database] Connecting to managed PostgreSQL database...');
        this.pgPool = new Pool({
          connectionString: dbUrl,
          ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
        });

        // Test connection
        const client = await this.pgPool.connect();
        try {
          await this.initPostgresSchema(client);
          this.isPostgres = true;
          console.log('[Database] Connected to PostgreSQL managed database successfully.');
        } finally {
          client.release();
        }
      } catch (err) {
        console.error('[Database] Failed to connect to PostgreSQL. Falling back to atomic persistent file store:', err);
        this.isPostgres = false;
      }
    }

    if (!this.isPostgres) {
      console.log('[Database] Initializing durable atomic storage engine...');
      await this.initFileStore();
    }

    this.initialized = true;
  }

  public isUsingPostgres(): boolean {
    return this.isPostgres;
  }

  private async initPostgresSchema(client: pg.PoolClient): Promise<void> {
    // Create tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(64) NOT NULL,
        price NUMERIC NOT NULL,
        quantity INT NOT NULL,
        data JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(64) PRIMARY KEY,
        customer_email VARCHAR(255) NOT NULL,
        total NUMERIC NOT NULL,
        order_status VARCHAR(64) NOT NULL,
        payment_status VARCHAR(64) NOT NULL,
        data JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);

      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(64) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        role VARCHAR(32) NOT NULL,
        data JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

      CREATE TABLE IF NOT EXISTS settings (
        id VARCHAR(64) PRIMARY KEY,
        data JSONB NOT NULL
      );
    `);

    // Seed products if table is empty
    const { rows: prodRows } = await client.query('SELECT COUNT(*) as count FROM products');
    if (parseInt(prodRows[0].count, 10) === 0) {
      console.log('[Database] Seeding 30 initial luxury watch products to PostgreSQL...');
      for (const p of INITIAL_PRODUCTS) {
        await client.query(
          'INSERT INTO products (id, name, category, price, quantity, data) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO NOTHING',
          [p.id, p.name, p.category, p.discountPrice || p.price, p.quantity, JSON.stringify(p)]
        );
      }
    }

    // Seed default admin and demo user
    const { rows: userRows } = await client.query('SELECT COUNT(*) as count FROM users WHERE email = $1', ['admin@zikala.com']);
    if (parseInt(userRows[0].count, 10) === 0) {
      const adminPass = process.env.ADMIN_INITIAL_PASSWORD || 'admin123';
      const adminHash = await hashPassword(adminPass);
      const adminUser: User = {
        id: 'usr-admin',
        name: 'Zikala Head Administrator',
        email: 'admin@zikala.com',
        phone: '0300-1122334',
        role: 'admin',
        addresses: [
          {
            id: 'addr-hq',
            isDefault: true,
            fullName: 'Zikala Flagship Store',
            phone: '0300-1122334',
            address: 'Boutique #4, Dolmen Mall Clifton, Marine Drive',
            city: 'Karachi',
            province: 'Sindh',
            postalCode: '75600',
          },
        ],
      };
      await client.query(
        'INSERT INTO users (id, email, password_hash, role, data) VALUES ($1, $2, $3, $4, $5)',
        [adminUser.id, adminUser.email, adminHash, 'admin', JSON.stringify(adminUser)]
      );

      const demoHash = await hashPassword('demo123');
      const demoUser: User = {
        id: 'usr-demo',
        name: 'Shahzaib Ahmed',
        email: 'shahzaib@example.com',
        phone: '0321-9876543',
        role: 'customer',
        addresses: [
          {
            id: 'addr-1',
            isDefault: true,
            fullName: 'Shahzaib Ahmed',
            phone: '0321-9876543',
            address: 'House #42, Street 15, Sector F-7/2',
            city: 'Islamabad',
            province: 'Islamabad Capital Territory',
            postalCode: '44000',
          },
        ],
      };
      await client.query(
        'INSERT INTO users (id, email, password_hash, role, data) VALUES ($1, $2, $3, $4, $5)',
        [demoUser.id, demoUser.email, demoHash, 'customer', JSON.stringify(demoUser)]
      );
    }

    // Seed settings
    const { rows: setRows } = await client.query('SELECT COUNT(*) as count FROM settings WHERE id = $1', ['default']);
    if (parseInt(setRows[0].count, 10) === 0) {
      await client.query('INSERT INTO settings (id, data) VALUES ($1, $2)', ['default', JSON.stringify(DEFAULT_SETTINGS)]);
    }
  }

  private async initFileStore(): Promise<void> {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }

      let loaded = false;
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.products && parsed.products.length >= 30) {
          this.fileData = parsed;
          loaded = true;
        }
      }

      if (!loaded) {
        this.fileData.products = INITIAL_PRODUCTS;
        this.fileData.orders = INITIAL_ORDERS;
        this.fileData.settings = DEFAULT_SETTINGS;
      }

      // Ensure bcrypt password hashes for default users
      const adminPass = process.env.ADMIN_INITIAL_PASSWORD || 'admin123';
      const existingAdmin = this.fileData.users.find((u) => u.email === 'admin@zikala.com');
      if (!existingAdmin) {
        const adminHash = await hashPassword(adminPass);
        this.fileData.users.push({
          id: 'usr-admin',
          name: 'Zikala Head Administrator',
          email: 'admin@zikala.com',
          phone: '0300-1122334',
          role: 'admin',
          addresses: [],
          passwordHash: adminHash,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      } else if (!existingAdmin.passwordHash) {
        existingAdmin.passwordHash = await hashPassword(adminPass);
      }

      const existingDemo = this.fileData.users.find((u) => u.email === 'demo@zikala.com');
      if (!existingDemo) {
        const demoHash = await hashPassword('demo123');
        this.fileData.users.push({
          id: 'usr-demo',
          name: 'Demo Customer',
          email: 'demo@zikala.com',
          phone: '0300-9988776',
          role: 'customer',
          addresses: [],
          passwordHash: demoHash,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      } else if (!existingDemo.passwordHash) {
        existingDemo.passwordHash = await hashPassword('demo123');
      }

      const shahzaibUser = this.fileData.users.find((u) => u.email === 'shahzaib@example.com');
      if (shahzaibUser && !shahzaibUser.passwordHash) {
        shahzaibUser.passwordHash = await hashPassword('shahzaib123');
      }

      this.saveFileStore();
    } catch (err) {
      console.error('[Database] File store load error:', err);
    }
  }

  /**
   * Atomic file save using temporary file + rename to guarantee zero file corruption.
   */
  private saveFileStore(): void {
    try {
      if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
      }
      const dataStr = JSON.stringify(this.fileData, null, 2);
      fs.writeFileSync(DB_TEMP_FILE, dataStr, 'utf-8');
      fs.renameSync(DB_TEMP_FILE, DB_FILE);
    } catch (err) {
      console.error('[Database] Failed atomic file write:', err);
    }
  }

  // ==========================================
  // PRODUCTS METHODS
  // ==========================================

  public async getProducts(): Promise<Product[]> {
    if (this.isPostgres && this.pgPool) {
      const res = await this.pgPool.query('SELECT data FROM products ORDER BY (data->>\'id\') ASC');
      return res.rows.map((r) => r.data as Product);
    }
    return this.fileData.products;
  }

  public async getProductById(id: string): Promise<Product | undefined> {
    if (this.isPostgres && this.pgPool) {
      const res = await this.pgPool.query('SELECT data FROM products WHERE id = $1', [id]);
      return res.rows[0]?.data as Product | undefined;
    }
    return this.fileData.products.find((p) => p.id === id);
  }

  public async addProduct(product: Product): Promise<Product> {
    if (this.isPostgres && this.pgPool) {
      await this.pgPool.query(
        'INSERT INTO products (id, name, category, price, quantity, data) VALUES ($1, $2, $3, $4, $5, $6)',
        [product.id, product.name, product.category, product.discountPrice || product.price, product.quantity, JSON.stringify(product)]
      );
      return product;
    }
    this.fileData.products.unshift(product);
    this.saveFileStore();
    return product;
  }

  public async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    if (this.isPostgres && this.pgPool) {
      const existing = await this.getProductById(id);
      if (!existing) return null;
      const updated: Product = { ...existing, ...updates };
      await this.pgPool.query(
        'UPDATE products SET name = $1, category = $2, price = $3, quantity = $4, data = $5 WHERE id = $6',
        [updated.name, updated.category, updated.discountPrice || updated.price, updated.quantity, JSON.stringify(updated), id]
      );
      return updated;
    }
    const idx = this.fileData.products.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    this.fileData.products[idx] = { ...this.fileData.products[idx], ...updates };
    this.saveFileStore();
    return this.fileData.products[idx];
  }

  public async deleteProduct(id: string): Promise<boolean> {
    if (this.isPostgres && this.pgPool) {
      const res = await this.pgPool.query('DELETE FROM products WHERE id = $1', [id]);
      return (res.rowCount || 0) > 0;
    }
    const idx = this.fileData.products.findIndex((p) => p.id === id);
    if (idx === -1) return false;
    this.fileData.products.splice(idx, 1);
    this.saveFileStore();
    return true;
  }

  public async addProductReview(productId: string, review: any): Promise<Product | null> {
    const product = await this.getProductById(productId);
    if (!product) return null;
    const reviews = product.reviews || [];
    reviews.unshift(review);
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = parseFloat((totalRating / reviews.length).toFixed(1));

    return this.updateProduct(productId, {
      reviews,
      reviewCount: reviews.length,
      rating: avgRating,
    });
  }

  // ==========================================
  // ORDERS METHODS
  // ==========================================

  public async getOrders(userEmail?: string): Promise<Order[]> {
    if (this.isPostgres && this.pgPool) {
      let query = 'SELECT data FROM orders';
      const params: any[] = [];
      if (userEmail) {
        query += ' WHERE LOWER(customer_email) = LOWER($1)';
        params.push(userEmail);
      }
      query += ' ORDER BY created_at DESC';
      const res = await this.pgPool.query(query, params);
      return res.rows.map((r) => r.data as Order);
    }
    if (userEmail) {
      return this.fileData.orders.filter(
        (o) => o.customer.email.toLowerCase() === userEmail.toLowerCase()
      );
    }
    return this.fileData.orders;
  }

  public async getOrderById(id: string): Promise<Order | undefined> {
    if (this.isPostgres && this.pgPool) {
      const res = await this.pgPool.query('SELECT data FROM orders WHERE id = $1', [id]);
      return res.rows[0]?.data as Order | undefined;
    }
    return this.fileData.orders.find((o) => o.id === id);
  }

  public async addOrder(order: Order): Promise<Order> {
    // Decrement stock for ordered watches
    for (const item of order.items) {
      const p = await this.getProductById(item.productId);
      if (p) {
        const newQty = Math.max(0, p.quantity - item.quantity);
        await this.updateProduct(p.id, {
          quantity: newQty,
          stockStatus: newQty > 0 ? (newQty <= 3 ? 'Low Stock' : 'In Stock') : 'Out of Stock',
        });
      }
    }

    if (this.isPostgres && this.pgPool) {
      await this.pgPool.query(
        'INSERT INTO orders (id, customer_email, total, order_status, payment_status, data) VALUES ($1, $2, $3, $4, $5, $6)',
        [order.id, order.customer.email, order.total, order.orderStatus, order.paymentStatus, JSON.stringify(order)]
      );
      return order;
    }
    this.fileData.orders.unshift(order);
    this.saveFileStore();
    return order;
  }

  public async updateOrderStatus(
    id: string,
    status: Order['orderStatus'],
    paymentStatus?: Order['paymentStatus']
  ): Promise<Order | null> {
    const order = await this.getOrderById(id);
    if (!order) return null;

    order.orderStatus = status;
    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }
    order.timeline.push({
      status,
      timestamp: new Date().toLocaleString('en-PK'),
      description: `Status updated to ${status} by Administrator.`,
    });

    if (this.isPostgres && this.pgPool) {
      await this.pgPool.query(
        'UPDATE orders SET order_status = $1, payment_status = $2, data = $3 WHERE id = $4',
        [order.orderStatus, order.paymentStatus, JSON.stringify(order), id]
      );
      return order;
    }

    const idx = this.fileData.orders.findIndex((o) => o.id === id);
    if (idx !== -1) {
      this.fileData.orders[idx] = order;
      this.saveFileStore();
    }
    return order;
  }

  // ==========================================
  // USERS & AUTH METHODS
  // ==========================================

  public async getUsers(): Promise<User[]> {
    if (this.isPostgres && this.pgPool) {
      const res = await this.pgPool.query('SELECT data FROM users');
      return res.rows.map((r) => r.data as User);
    }
    return this.fileData.users.map((u) => {
      const { passwordHash: _, ...rest } = u;
      return rest;
    });
  }

  public async findUserRecordByEmail(email: string): Promise<UserRecord | undefined> {
    if (this.isPostgres && this.pgPool) {
      const res = await this.pgPool.query('SELECT id, email, password_hash, data FROM users WHERE LOWER(email) = LOWER($1)', [email]);
      if (res.rows.length === 0) return undefined;
      const row = res.rows[0];
      return {
        ...row.data,
        passwordHash: row.password_hash,
      };
    }
    return this.fileData.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  public async findUserById(id: string): Promise<User | undefined> {
    if (this.isPostgres && this.pgPool) {
      const res = await this.pgPool.query('SELECT data FROM users WHERE id = $1', [id]);
      return res.rows[0]?.data as User | undefined;
    }
    const u = this.fileData.users.find((u) => u.id === id);
    if (!u) return undefined;
    const { passwordHash: _, ...rest } = u;
    return rest;
  }

  public async addUser(user: User, passwordHash: string): Promise<User> {
    const record: UserRecord = {
      ...user,
      passwordHash,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (this.isPostgres && this.pgPool) {
      await this.pgPool.query(
        'INSERT INTO users (id, email, password_hash, role, data) VALUES ($1, $2, $3, $4, $5)',
        [user.id, user.email, passwordHash, user.role, JSON.stringify(user)]
      );
      return user;
    }

    this.fileData.users.push(record);
    this.saveFileStore();
    return user;
  }

  public async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    if (this.isPostgres && this.pgPool) {
      const existing = await this.findUserById(id);
      if (!existing) return null;
      const updated: User = { ...existing, ...updates };
      await this.pgPool.query(
        'UPDATE users SET data = $1 WHERE id = $2',
        [JSON.stringify(updated), id]
      );
      return updated;
    }

    const idx = this.fileData.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    this.fileData.users[idx] = {
      ...this.fileData.users[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveFileStore();
    const { passwordHash: _, ...rest } = this.fileData.users[idx];
    return rest;
  }

  // ==========================================
  // SETTINGS METHODS
  // ==========================================

  public async getSettings(): Promise<StoreSettings> {
    if (this.isPostgres && this.pgPool) {
      const res = await this.pgPool.query('SELECT data FROM settings WHERE id = $1', ['default']);
      return (res.rows[0]?.data as StoreSettings) || DEFAULT_SETTINGS;
    }
    return this.fileData.settings || DEFAULT_SETTINGS;
  }

  public async updateSettings(settings: Partial<StoreSettings>): Promise<StoreSettings> {
    const current = await this.getSettings();
    const updated = { ...current, ...settings };

    if (this.isPostgres && this.pgPool) {
      await this.pgPool.query(
        'INSERT INTO settings (id, data) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET data = $2',
        ['default', JSON.stringify(updated)]
      );
      return updated;
    }

    this.fileData.settings = updated;
    this.saveFileStore();
    return updated;
  }
}

export const db = new ManagedDatabase();
