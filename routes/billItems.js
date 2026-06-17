const express = require('express');
const router = express.Router();
const BillItem = require('../models/BillItem');

// GET /api/bill-items - Get all bill items
router.get('/', async (req, res) => {
  try {
    const items = await BillItem.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    console.error('Error fetching bill items:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch bill items',
      message: error.message
    });
  }
});

// POST /api/bill-items - Add new bill item
router.post('/', async (req, res) => {
  try {
    const itemData = req.body;
    
    const existingItem = await BillItem.findOne({ id: itemData.id });
    if (existingItem) {
      return res.status(400).json({
        success: false,
        error: 'Item with this ID already exists'
      });
    }
    
    const newItem = new BillItem(itemData);
    await newItem.save();
    
    res.json({
      success: true,
      message: 'Item added successfully',
      data: newItem
    });
  } catch (error) {
    console.error('Error adding bill item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add bill item',
      message: error.message
    });
  }
});

// DELETE /api/bill-items/:id - Delete bill item
router.delete('/:id', async (req, res) => {
  try {
    const itemId = parseInt(req.params.id);
    
    const deletedItem = await BillItem.findOneAndDelete({ id: itemId });
    
    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        error: 'Item not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Item deleted successfully',
      data: { id: itemId }
    });
  } catch (error) {
    console.error('Error deleting bill item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete bill item'
    });
  }
});

// DELETE /api/bill-items - Delete all bill items
router.delete('/', async (req, res) => {
  try {
    const result = await BillItem.deleteMany({});
    
    res.json({
      success: true,
      message: 'All items cleared successfully',
      data: { deletedCount: result.deletedCount }
    });
  } catch (error) {
    console.error('Error clearing bill items:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear bill items'
    });
  }
});

module.exports = router;