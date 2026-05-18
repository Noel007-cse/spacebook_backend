const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes    = require('./routes/auth.routes');
const spacesRoutes  = require('./routes/spaces.routes');
const bookingRoutes = require('./routes/bookings.routes');
const recomRoutes   = require('./routes/recom.routes');
const favoritesRoutes = require('./routes/favorites.routes');
const adminRoutes   = require('./routes/admin.routes');

const app = express();

app.use(cors());
app.use(express.json());

// Serve admin dashboard static files
app.use('/admin', express.static(path.join(__dirname, '..', 'public', 'admin')));

app.get('/', (req, res) => {
  res.json({ message: 'SpaceBook API is running!' });
});

app.use('/api/auth',     authRoutes);
app.use('/api/spaces',   spacesRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/recom',    recomRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/admin',    adminRoutes);

module.exports = app;