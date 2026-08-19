const express = require('express');
const cors = require('cors');
require('dotenv').config();
const graphRoutes = require('./routes/graphRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/graph', graphRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'SkillGraph Backend Engine', timestamp: new Date() });
});

// Serve static files from the React frontend app
const path = require('path');
app.use(express.static(path.join(__dirname, '../client/dist')));

// Anything that doesn't match the API routes, send back the React index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 SkillGraph Backend Server active on port ${PORT}`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api/graph`);
  console.log(`====================================================`);
});
