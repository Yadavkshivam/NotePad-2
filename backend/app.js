import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './src/routes/authRoutes.js';
import noteRoutes from './src/routes/noteRoutes.js';


const app = express();


app.use(express.json());
app.use(morgan('dev'));
app.use(cors({ 
  origin: ["http://localhost:5173", "http://localhost:5174"],
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