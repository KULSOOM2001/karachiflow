require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/reports', require('./routes/reports'));

// Serve pages
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/report', (req, res) => res.sendFile(path.join(__dirname, 'public', 'pages', 'report.html')));
app.get('/feed', (req, res) => res.sendFile(path.join(__dirname, 'public', 'pages', 'feed.html')));
app.get('/zones', (req, res) => res.sendFile(path.join(__dirname, 'public', 'pages', 'zones.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'public', 'pages', 'admin.html')));

// MongoDB connect
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/karachiflow';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    startServer();
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    console.log('⚠️  Starting server without database (reports will not persist)');
    startServer();
  });

function startServer() {
  app.listen(PORT, () => {
    console.log(`\n🚀 KarachiFlow running on http://localhost:${PORT}`);
    console.log(`📊 API Base: http://localhost:${PORT}/api/reports`);
    console.log(`👤 Citizen: http://localhost:${PORT}/`);
    console.log(`⚙️  Admin: http://localhost:${PORT}/admin\n`);
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
});
