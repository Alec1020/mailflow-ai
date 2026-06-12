require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const cookieParser = require("cookie-parser");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Import routes
const authRoutes = require('./src/routes/authRoutes');
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));