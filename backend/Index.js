import express from 'express';
import path from 'path';
import url from 'url';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import productRouter from './routes/product.js';
import factureRouter from './routes/facture.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 8800;

// Define the directory where static files are located
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  
  methods: 'GET,POST,PUT,DELETE',
  credentials: true,
}));
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api/products', productRouter);
app.use('/api/factures', factureRouter);

// Serve static files from the Vite build
app.use(express.static(path.join(__dirname, 'dist')));

// Handle React routing, return the main index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
