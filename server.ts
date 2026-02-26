import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("spideystore.db");
const JWT_SECRET = process.env.JWT_SECRET || "web-slinger-secret-key";

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    category TEXT,
    image_url TEXT,
    stock INTEGER DEFAULT 0,
    rating REAL DEFAULT 0,
    reviews_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS cart_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    product_id INTEGER,
    quantity INTEGER DEFAULT 1,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    total_amount REAL NOT NULL,
    status TEXT DEFAULT 'pending',
    address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    product_id INTEGER,
    quantity INTEGER,
    price REAL,
    FOREIGN KEY(order_id) REFERENCES orders(id),
    FOREIGN KEY(product_id) REFERENCES products(id)
  );
`);

// Seed initial products if empty
const productCount = db.prepare("SELECT COUNT(*) as count FROM products").get() as { count: number };
if (productCount.count === 0) {
  const insertProduct = db.prepare(`
    INSERT INTO products (name, description, price, category, image_url, stock, rating, reviews_count, is_featured)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const sampleProducts = [
    ["Classic Spider-Man Suit", "High-quality spandex suit with web patterns.", 149.99, "Clothing", "https://picsum.photos/seed/spidey1/600/800", 10, 4.9, 120, 1],
    ["Web-Shooter Replica", "Functional web-shooter with liquid web fluid.", 89.99, "Accessories", "https://picsum.photos/seed/spidey2/600/800", 25, 4.8, 85, 1],
    ["Symbiote Black Hoodie", "Comfortable black hoodie with the white spider logo.", 59.99, "Clothing", "https://picsum.photos/seed/spidey3/600/800", 50, 4.7, 210, 0],
    ["Spider-Gwen Action Figure", "Highly detailed 12-inch action figure.", 34.99, "Toys", "https://picsum.photos/seed/spidey4/600/800", 15, 4.9, 45, 0],
    ["Daily Bugle Newspaper Bag", "Vintage style messenger bag.", 45.00, "Accessories", "https://picsum.photos/seed/spidey5/600/800", 30, 4.6, 60, 0],
    ["Miles Morales T-Shirt", "Graffiti style design on 100% cotton.", 29.99, "Clothing", "https://picsum.photos/seed/spidey6/600/800", 100, 4.8, 150, 1]
  ];

  for (const p of sampleProducts) {
    insertProduct.run(...p);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Auth Middleware
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

  // API Routes
  app.post("/api/auth/register", async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const result = db.prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)").run(name, email, hashedPassword);
      const token = jwt.sign({ id: result.lastInsertRowid, email, name }, JWT_SECRET);
      res.json({ token, user: { id: result.lastInsertRowid, name, email } });
    } catch (e) {
      res.status(400).json({ error: "Email already exists" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, JWT_SECRET);
      res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  });

  app.get("/api/products", (req, res) => {
    const products = db.prepare("SELECT * FROM products").all();
    res.json(products);
  });

  app.get("/api/products/:id", (req, res) => {
    const product = db.prepare("SELECT * FROM products WHERE id = ?").get(req.params.id);
    if (product) res.json(product);
    else res.status(404).json({ error: "Product not found" });
  });

  app.get("/api/cart", authenticateToken, (req: any, res) => {
    const items = db.prepare(`
      SELECT c.*, p.name, p.price, p.image_url 
      FROM cart_items c 
      JOIN products p ON c.product_id = p.id 
      WHERE c.user_id = ?
    `).all(req.user.id);
    res.json(items);
  });

  app.post("/api/cart", authenticateToken, (req: any, res) => {
    const { product_id, quantity } = req.body;
    const existing = db.prepare("SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?").get(req.user.id, product_id) as any;
    if (existing) {
      db.prepare("UPDATE cart_items SET quantity = quantity + ? WHERE id = ?").run(quantity, existing.id);
    } else {
      db.prepare("INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)").run(req.user.id, product_id, quantity);
    }
    res.json({ success: true });
  });

  app.delete("/api/cart/:id", authenticateToken, (req: any, res) => {
    db.prepare("DELETE FROM cart_items WHERE id = ? AND user_id = ?").run(req.params.id, req.user.id);
    res.json({ success: true });
  });

  app.post("/api/orders", authenticateToken, (req: any, res) => {
    const { total_amount, address, items } = req.body;
    const result = db.prepare("INSERT INTO orders (user_id, total_amount, address) VALUES (?, ?, ?)").run(req.user.id, total_amount, address);
    const orderId = result.lastInsertRowid;
    
    const insertItem = db.prepare("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)");
    for (const item of items) {
      insertItem.run(orderId, item.product_id, item.quantity, item.price);
    }
    
    db.prepare("DELETE FROM cart_items WHERE user_id = ?").run(req.user.id);
    res.json({ orderId });
  });

  app.get("/api/orders", authenticateToken, (req: any, res) => {
    const orders = db.prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC").all(req.user.id);
    res.json(orders);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
