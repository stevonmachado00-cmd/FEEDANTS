require('dotenv').config();
const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const securityMiddleware = require('./middleware/securityMiddleware');
const { generalLimiter } = require('./middleware/rateLimiter');
const errorHandler = require('./middleware/errorHandler');

const authRoutes = require('./routes/authRoutes');
const competitionRoutes = require('./routes/competitionRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const submissionRoutes = require('./routes/submissionRoutes');

const app = express();
const server = http.createServer(app);

// Connect to MongoDB
connectDB();

// Apply Security Middleware Stack
securityMiddleware(app);

// Health check endpoint (for load balancers & uptime monitors)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'Feedants Competition Service',
  });
});

// Apply Rate Limiter to API routes
app.use('/api', generalLimiter);

// Make uploads folder static
app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/competitions', competitionRoutes);
app.use('/api', registrationRoutes);
app.use('/api', submissionRoutes);

// Serve static frontend build if dist folder exists (Production deployment)
const frontendDistPath = path.resolve(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  console.log('📦 Serving production frontend build from:', frontendDistPath);
  app.use(express.static(frontendDistPath));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

// Centralized Error Handler
app.use(errorHandler);

// Socket.io Setup for Real-time live spots & event streams
const io = new Server(server, {
  cors: {
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log('⚡ Socket client connected:', socket.id);

  socket.on('join_competition', (competitionId) => {
    socket.join(`competition_${competitionId}`);
    console.log(`Socket ${socket.id} joined room competition_${competitionId}`);
  });

  socket.on('disconnect', () => {
    console.log('Socket client disconnected:', socket.id);
  });
});

app.set('io', io);

// Edge Case Guard: Uncaught Exception and Rejection Handling
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception thrown:', err);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Feedants Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
