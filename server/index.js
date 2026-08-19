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

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 SkillGraph Backend Server active on port ${PORT}`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api/graph`);
  console.log(`====================================================`);
});
