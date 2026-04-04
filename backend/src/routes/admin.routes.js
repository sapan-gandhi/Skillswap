const router = require('express').Router();
const { getUsers, banUser, getSwaps, getAnalytics, exportUsers, updateUserRole } = require('../controllers/admin.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.use(protect, adminOnly);

router.get('/users', getUsers);
router.put('/ban/:id', banUser);
router.put('/users/:id/role', updateUserRole);
router.get('/swaps', getSwaps);
router.get('/analytics', getAnalytics);
router.get('/export/users', exportUsers);

module.exports = router;
