// ===== LOAD ENVIRONMENT VARIABLES FIRST =====
require('dotenv').config();

// ===== DEBUG: Check if variables are loaded =====
console.log('========================================');
console.log('🔍 Environment Variables Check:');
console.log('✅ MONGODB_URI:', process.env.MONGODB_URI ? '✅ Loaded' : '❌ NOT FOUND');
console.log('✅ PORT:', process.env.PORT || '❌ NOT FOUND');
console.log('✅ ADMIN_PASSWORD:', process.env.ADMIN_PASSWORD ? '✅ Loaded' : '❌ NOT FOUND');
console.log('========================================');

// Exit if MONGODB_URI is not defined
if (!process.env.MONGODB_URI) {
  console.error('❌ ERROR: MONGODB_URI is not defined in .env file');
  process.exit(1);
}

// ===== REST OF YOUR SERVER CODE =====
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dns = require('node:dns');
const app = express();

// Import routes
const ratesRoutes = require('./routes/rates');
const billItemsRoutes = require('./routes/billItems');
const adjustmentsRoutes = require('./routes/adjustments');

// Security middleware
app.use(helmet());

// CORS configuration - ALLOW FROM ANYWHERE (but with restrictions)
const corsOptions = {
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ===== FIXED DATABASE CONNECTION =====
const connectDB = async () => {
  try {
    console.log('📡 Connecting to MongoDB Atlas...');
    dns.setServers(["1.1.1.1"])
    // REMOVED deprecated options
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ MongoDB connected successfully');
    console.log(`📊 Database: ${mongoose.connection.name}`);
    console.log(`📍 Host: ${mongoose.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    console.log('\n🔧 Troubleshooting tips:');
    console.log('1. Check if IP is whitelisted in MongoDB Atlas');
    console.log('2. Verify username/password are correct');
    console.log('3. Ensure database name "bwjdbs" exists');
    console.log('4. Check network/firewall settings');
    process.exit(1);
  }
};

// MongoDB connection events
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed');
  process.exit(0);
});

// Routes
app.get('/', (req, res) => {
  res.json({
    name: 'BWJ Jewellery Manager API',
    version: '1.0.0',
    status: 'running',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    endpoints: {
      rates: '/api/rates',
      billItems: '/api/bill-items',
      adjustments: '/api/adjustments',
      summary: '/api/bill-items/summary'
    },
    timestamp: new Date()
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    uptime: process.uptime(),
    timestamp: new Date()
  });
});

// API routes
app.use('/api/rates', ratesRoutes);
app.use('/api/bill-items', billItemsRoutes);
app.use('/api/adjustments', adjustmentsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'API endpoint not found'
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// ===== FIXED: Bind to 0.0.0.0 for anywhere access =====
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  
  // BIND TO 0.0.0.0 - ALLOW ACCESS FROM ANYWHERE
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Local URL: http://localhost:${PORT}`);
    console.log(`📍 Network URL: http://0.0.0.0:${PORT}`);
    console.log(`📍 Access from anywhere: http://YOUR_PUBLIC_IP:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
};

startServer();

module.exports = app;