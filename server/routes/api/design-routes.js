// server/routes/api/design-routes.js
const express = require('express');
const router = express.Router();
const { Design } = require('../../models');
const { authMiddleware } = require('../../utils/auth');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary (you'll need to set up an account)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Save design route
router.post('/save', authMiddleware, async (req, res) => {
  try {
    const { imageData, trackInfo, designSettings } = req.body;
    const userId = req.user._id;

    // Upload image to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(imageData, {
      folder: 'jubilee-designs',
      resource_type: 'image',
    });

// Save design to database
const design = await Design.create({
    userId,
    imageUrl: uploadResponse.secure_url,
    cloudinaryId: uploadResponse.public_id,
    trackInfo,
    designSettings,
});

    res.json({ 
      success: true, 
      design,
      message: 'Design saved successfully' 
    });

  } catch (error) {
    console.error('Design save error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error saving design' 
    });
  }
});

module.exports = router;