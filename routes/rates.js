const express = require('express');
const router = express.Router();
const Rate = require('../models/Rate');

// GET /api/rates - Get latest rates
router.get('/', async (req, res) => {
  try {
    let rates = await Rate.findOne().sort({ updatedAt: -1 });
    
    if (!rates) {
      rates = {
        gold18KRate: '',
        gold20KRate: '',
        gold22KRate: '',
        gold24KRate: '',
        silverRate: '',
        silver925Rate: ''
      };
    }
    
    res.json({
      success: true,
      data: rates,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error fetching rates:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch rates',
      message: error.message
    });
  }
});

// POST /api/rates - Save or update rates
router.post('/', async (req, res) => {
  try {
    const ratesData = req.body;
    
    const newRates = new Rate({
      ...ratesData,
      updatedAt: new Date()
    });
    
    await newRates.save();
    
    res.json({
      success: true,
      message: 'Rates saved successfully',
      data: newRates
    });
  } catch (error) {
    console.error('Error saving rates:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save rates',
      message: error.message
    });
  }
});

module.exports = router;