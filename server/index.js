import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import analyzeRoute from './routes/analyze.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ['https://phishing-analyzer.vercel.app', 'http://localhost:5173'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json());
app.use('/api/analyze', analyzeRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});