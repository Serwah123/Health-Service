import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from '@/config/index.js';
import { errorHandler } from '@/middleware/errorHandler.js';

// Import routes
import authRoutes from '@/routes/auth.js';
import studyRoutes from '@/routes/studies.js';
import patientRoutes from '@/routes/patients.js';
import formRoutes from '@/routes/forms.js';
import matchRoutes from '@/routes/matches.js';
import aiRoutes from '@/routes/ai.js';
import exportRoutes from '@/routes/export.js';

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
});

if (config.nodeEnv === 'production') {
  app.use(limiter);
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
if (config.nodeEnv !== 'test') {
  app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv,
    version: process.env.npm_package_version || '1.0.0',
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/studies', studyRoutes);  
app.use('/api/patients', patientRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/genai', aiRoutes);
app.use('/api/export', exportRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global error handler
app.use(errorHandler);

// Start server
const server = app.listen(config.port, () => {
  console.log(`🚀 Health Service API Server running on port ${config.port}`);
  console.log(`📍 Environment: ${config.nodeEnv}`);
  console.log(`🔗 Health check: http://localhost:${config.port}/health`);
  
  if (config.nodeEnv === 'development') {
    console.log(`📚 API Base URL: http://localhost:${config.port}/api`);
    console.log('Available endpoints:');
    console.log('  🔐 Auth: /api/auth');
    console.log('  📊 Studies: /api/studies');
    console.log('  👥 Patients: /api/patients');
    console.log('  📝 Forms: /api/forms');
    console.log('  🎯 Matches: /api/matches');
    console.log('  🤖 AI/GenAI: /api/genai');
    console.log('  📤 Export: /api/export');
  }
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});

export default app;
