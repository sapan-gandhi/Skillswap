const router = require('express').Router();
const upload = require('../middleware/upload.middleware');
const { protect } = require('../middleware/auth.middleware');
const User = require('../models/User.model');
const path = require('path');
const fs = require('fs');

/**
 * POST /api/upload/profile-photo
 */
router.post('/profile-photo', protect, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded.' });

    // Delete old photo if exists
    const user = await User.findById(req.user._id);
    if (user.profilePhoto) {
      const oldPath = path.join(__dirname, '../../uploads', user.profilePhoto);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    user.profilePhoto = req.file.filename;
    await user.save();

    res.json({
      success: true,
      message: 'Photo uploaded successfully.',
      filename: req.file.filename,
      url: `${process.env.SERVER_URL || 'http://localhost:5000'}/uploads/${req.file.filename}`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Upload failed.' });
  }
});

module.exports = router;
