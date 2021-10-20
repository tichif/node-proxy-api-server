const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const weatherRoutes = require('./routes');

const app = express();

// Enable cors
app.use(cors());
// Set up a request limit
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10mn,
  max: 20,
});
app.use(limiter);
app.set('trust proxy', 1);

// routes
app.use('/api', weatherRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`App is running on port ${PORT}`));
