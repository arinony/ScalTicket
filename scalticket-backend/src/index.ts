import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/orders', orderRoutes);
app.use('/uploads', express.static('uploads'));

// Route de test
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'ScalTicket API is running 🚀' });
});

app.listen(PORT, () => {
  console.log(`
  ===========================================
  🚀 SERVEUR SCALTICKET DÉMARRÉ
  📡 Port: ${PORT}
  🌍 Environnement: Development
  ===========================================
  `);
});