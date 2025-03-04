import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './Config/db.js'; // ✅ Fixed Path
import bonsaiRoutes from './routes/bonsaiRoutes.js'; // ✅ Fixed Path
import treeRoutes from './routes/treeRoutes.js';
import productRoutes from './routes/productRoutes.js';
import errorHandler from './Midileware/errorMiddleware.js';
import cartRoutes from'./routes/cartRoutes.js'
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRouts.js';
import diseaseRoutes from './routes/diseaseRoutes.js';
import orderRoutes from './routes/orderRouts.js';
// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Tree Care API is running...');
});

// Routes
app.use(cors({ origin: 'http://localhost:5173' }));
app.use('/api/users', userRoutes);
app.use('/api/bonsai', bonsaiRoutes);
app.use('/api/diseases', diseaseRoutes);
app.use('/api/products', productRoutes);
app.use('/api/trees', treeRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/orders', orderRoutes);

// Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
