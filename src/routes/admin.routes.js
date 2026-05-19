const express = require('express');
const router = express.Router();
const verifyAdmin = require('../middleware/admin.middleware');
const {
  getDashboardStats,
  getAllBookings,
  getAllUsers,
  getAllSpaces,
  approveSpace,
  rejectSpace,
} = require('../controllers/admin.controller');
const { testEmailEndpoint } = require('../services/email.service');

router.get('/dashboard',             verifyAdmin, getDashboardStats);
router.get('/bookings',              verifyAdmin, getAllBookings);
router.get('/users',                 verifyAdmin, getAllUsers);
router.get('/spaces',                verifyAdmin, getAllSpaces);
router.patch('/spaces/:id/approve',  verifyAdmin, approveSpace);
router.patch('/spaces/:id/reject',   verifyAdmin, rejectSpace);
router.get('/test-email',            testEmailEndpoint);

module.exports = router;
