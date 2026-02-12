import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
dotenv.config();

import authRoutes from './src/routes/authRoutes.js';
import noteRoutes from './src/routes/noteRoutes.js';


const app = express();

console.log('🌐 CLIENT_ORIGIN:', process.env.CLIENT_ORIGIN);

app.use(express.json());
app.use(morgan('dev'));

// CORS configuration - supports multiple origins for dev and production
const allowedOrigins = process.env.CLIENT_ORIGIN 
  ? process.env.CLIENT_ORIGIN.split(',') 
  : ['http://localhost:5173'];

app.use(cors({ 
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));



//  app.options('/*', cors()); // handle preflight for all routes



app.get('/', (req, res) => {
res.json({ status: 'ok', message: 'Notes API running' });
});


app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);


// Error handler
app.use((err, req, res, next) => {
console.error('Error:', err);
res.status(err.status || 500).json({ message: err.message || 'Server error' });
});


export default app;