const express = require('express');
const router = express.Router();
const Adjustment = require('../models/Adjustment');

// GET /api/adjustments/:type - Get adjustments by type
router.get('/:type', async (req, res) => {
  try {
    const { type } = req.params;
    
    if (!['gold', 'silver'].includes(type)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid adjustment type. Must be "gold" or "silver"'
      });
    }
    
    const adjustments = await Adjustment.find({ type });
    const adjustmentMap = {};
    adjustments.forEach(adj => {
      adjustmentMap[adj.itemId] = adj.adjustments;
    });
    
    res.json({
      success: true,
      type,
      data: adjustmentMap
    });
  } catch (error) {
    console.error('Error fetching adjustments:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch adjustments',
      message: error.message
    });
  }
});

// POST /api/adjustments - Save single adjustment
router.post('/', async (req, res) => {
  try {
    const { type, itemId, adjustments } = req.body;
    
    if (!['gold', 'silver'].includes(type)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid adjustment type'
      });
    }
    
    const savedAdjustment = await Adjustment.findOneAndUpdate(
      { type, itemId },
      { type, itemId, adjustments, updatedAt: new Date() },
      { upsert: true, new: true }
    );
    
    res.json({
      success: true,
      message: 'Adjustment saved successfully',
      data: savedAdjustment
    });
  } catch (error) {
    console.error('Error saving adjustment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save adjustment'
    });
  }
});

// DELETE /api/adjustments/:type - Delete all adjustments by type
router.delete('/:type', async (req, res) => {
  try {
    const { type } = req.params;
    
    if (!['gold', 'silver'].includes(type)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid adjustment type'
      });
    }
    
    const result = await Adjustment.deleteMany({ type });
    
    res.json({
      success: true,
      message: `${type} adjustments cleared successfully`,
      data: { deletedCount: result.deletedCount }
    });
  } catch (error) {
    console.error('Error clearing adjustments:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear adjustments'
    });
  }
});

module.exports = router;