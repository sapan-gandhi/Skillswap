const router = require('express').Router();
const { createSwap, getSwaps, updateSwap, getSwapById } = require('../controllers/swap.controller');
const { protect } = require('../middleware/auth.middleware');
const { createSwapValidation, updateSwapValidation } = require('../middleware/validation.middleware');

router.post('/', protect, createSwapValidation, createSwap);
router.get('/', protect, getSwaps);
router.get('/:id', protect, getSwapById);
router.put('/:id', protect, updateSwapValidation, updateSwap);

module.exports = router;
