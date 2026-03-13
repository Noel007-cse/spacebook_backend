const express = require('express');
const router = express.Router();
const {
  getAllSpaces,
  getSpaceById,
  createSpace,
  updateSpace,
  deleteSpace,
} = require('../controllers/spaces.controller');
const verifyToken = require('../middleware/auth.middleware');

router.get('/',       getAllSpaces);
router.get('/:id',    getSpaceById);
router.post('/',      verifyToken, createSpace);
router.put('/:id',    verifyToken, updateSpace);
router.delete('/:id', verifyToken, deleteSpace);

module.exports = router;