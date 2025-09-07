import express from 'express';
import dotenv from 'dotenv';
import { setupStaticServing } from './static-serve.js';
import { db } from './db.js';

dotenv.config();

const app = express();

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API endpoint to get all pickups
app.get('/api/pickups', async (req, res) => {
  try {
    const pickups = await db.selectFrom('pickups').selectAll().orderBy('requested_at', 'desc').execute();
    res.json(pickups);
  } catch (err) {
    console.error('Failed to fetch pickups:', err);
    res.status(500).json({ message: 'Failed to fetch pickups' });
  }
});

// API endpoint to create a new pickup
app.post('/api/pickups', async (req, res) => {
  const { name, address, email, phone, items_description } = req.body;

  if (!name || !address || !email || !items_description) {
    res.status(400).json({ message: 'Missing required fields' });
    return;
  }

  try {
    const newPickup = await db
      .insertInto('pickups')
      .values({
        name,
        address,
        email,
        phone,
        items_description,
        status: 'pending',
        requested_at: new Date().toISOString(),
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    res.status(201).json(newPickup);
  } catch (err) {
    console.error('Failed to create pickup:', err);
    res.status(500).json({ message: 'Failed to create pickup' });
  }
});


// Export a function to start the server
export async function startServer(port) {
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
  startServer(process.env.PORT || 3001);
}
