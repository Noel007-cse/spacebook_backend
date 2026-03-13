const express = require('express');
const cors = require('cors');

const authRoutes    = require('./routes/auth.routes');
const spacesRoutes  = require('./routes/spaces.routes');
const bookingRoutes = require('./routes/bookings.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'SpaceBook API is running!' });
});

app.use('/api/auth',     authRoutes);
app.use('/api/spaces',   spacesRoutes);
app.use('/api/bookings', bookingRoutes);

module.exports = app;