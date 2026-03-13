const express = require('express');
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  cancelBooking,
} = require('../controllers/bookings.controller');
const verifyToken = require('../middleware/auth.middleware');

router.post('/',           verifyToken, createBooking);
router.get('/mine',        verifyToken, getUserBookings);
router.put('/:id/cancel',  verifyToken, cancelBooking);

module.exports = router;