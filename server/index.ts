import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { setupStaticServing } from './static-serve.js';
import { db } from './db.js';
import { authenticateToken, AuthRequest } from './auth.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';

dotenv.config();

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key';

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer setup for image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// --- AUTH ROUTES ---

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ message: 'Name, email, and password are required' });
    return;
  }

  try {
    const existingUser = await db.selectFrom('users').where('email', '=', email).select('id').executeTakeFirst();
    if (existingUser) {
      res.status(409).json({ message: 'User with this email already exists' });
      return;
    }

    const password_hash = await bcrypt.hash(password, 10);

    const newUser = await db
      .insertInto('users')
      .values({ name, email, password_hash })
      .returning(['id', 'name', 'email', 'points'])
      .executeTakeFirstOrThrow();

    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '1d' });
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
    
    res.status(201).json(newUser);
  } catch (err) {
    console.error('Failed to register user:', err);
    res.status(500).json({ message: 'Failed to register user' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required' });
    return;
  }

  try {
    const user = await db.selectFrom('users').where('email', '=', email).selectAll().executeTakeFirst();

    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1d' });
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });

    const { password_hash, ...userWithoutPassword } = user;
    res.status(200).json(userWithoutPassword);
  } catch (err) {
    console.error('Failed to login:', err);
    res.status(500).json({ message: 'Failed to login' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully' });
});

app.get('/api/auth/me', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const user = await db.selectFrom('users')
      .where('id', '=', req.userId!)
      .select(['id', 'name', 'email', 'points'])
      .executeTakeFirst();

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (err) {
    console.error('Failed to fetch user profile:', err);
    res.status(500).json({ message: 'Failed to fetch user profile' });
  }
});


// --- PICKUP ROUTES ---

app.get('/api/pickups', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const pickups = await db.selectFrom('pickups')
      .where('user_id', '=', req.userId!)
      .selectAll()
      .orderBy('requested_at', 'desc')
      .execute();
    res.json(pickups);
  } catch (err) {
    console.error('Failed to fetch pickups:', err);
    res.status(500).json({ message: 'Failed to fetch pickups' });
  }
});

app.post('/api/pickups', authenticateToken, async (req: AuthRequest, res) => {
  const { address, items_description } = req.body;
  const userId = req.userId;

  if (!address || !items_description || !userId) {
    res.status(400).json({ message: 'Missing required fields' });
    return;
  }

  try {
    const user = await db.selectFrom('users').where('id', '=', userId).select(['name', 'email']).executeTakeFirstOrThrow();

    const newPickup = await db
      .insertInto('pickups')
      .values({
        user_id: userId,
        name: user.name,
        email: user.email,
        address,
        items_description,
        status: 'pending',
        requested_at: new Date().toISOString(),
      })
      .returningAll()
      .executeTakeFirstOrThrow();
    
    // Award points
    await db.updateTable('users').set((eb) => ({
      points: eb('points', '+', 10)
    })).where('id', '=', userId).execute();

    res.status(201).json(newPickup);
  } catch (err) {
    console.error('Failed to create pickup:', err);
    res.status(500).json({ message: 'Failed to create pickup' });
  }
});

// --- AI DETECTION ROUTE ---
app.post('/api/detect', authenticateToken, upload.single('ewasteImage'), (req, res) => {
  if (!req.file) {
    res.status(400).json({ message: 'No image file uploaded.' });
    return;
  }

  // Simulate AI detection
  const items = ['Laptop', 'Old Monitor', 'Smartphone', 'Keyboard', 'Broken Printer'];
  const detectedItem = items[Math.floor(Math.random() * items.length)];

  setTimeout(() => {
    res.status(200).json({ message: `AI detected: ${detectedItem}.` });
  }, 1500); // Simulate processing time
});


// Export a function to start the server
export async function startServer(port: number) {
  try {
    if (process.env.NODE_ENV === 'production') {
      setupStaticServing(app);
    }
    app.listen(port, () => {
      console.log(`API Server running on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

// Start the server directly if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('Starting server...');
  startServer(parseInt(process.env.PORT || '3001', 10));
}
