require("dotenv").config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const preferencesRoutes = require('./routes/preferences');
const generateImageRoute = require('./routes/generateImage');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // Vite dev server
  credentials: true
}));

app.use(bodyParser.json());

app.get('/test', (req, res) => {
  res.json({ message: "✅ Server is working!", timestamp: new Date() });
});

app.get('/api/test', (req, res) => {
  res.json({ message: "✅ API route is working!", timestamp: new Date() });
});

// Routes
app.use('/api', authRoutes);
app.use('/api/preferences', preferencesRoutes);
app.use('/api', generateImageRoute);

// ✅ Connect to MongoDB Atlas using .env variable
mongoose.connect(process.env.MONGO_URI, {
  dbName: 'fashionapp',
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('Mongo error:', err));

app.listen(5000, () => console.log('Server running on port 5000'));
