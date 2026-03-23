const express = require('express');
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  cancelBooking,
  getOtherUsersBookings,
  toggleConfirmBooking,
} = require('../controllers/bookings.controller');
const verifyToken = require('../middleware/auth.middleware');

router.post('/',                    verifyToken, createBooking);
router.get('/mine',                 verifyToken, getUserBookings);
router.put('/:id/cancel',           verifyToken, cancelBooking);
router.get('/my-spaces',            verifyToken, getOtherUsersBookings);
router.patch('/:id/confirm-toggle', verifyToken, toggleConfirmBooking);

module.exports = router;