const express = require('express');
const router = express.Router();
const WaterUsage = require('../models/WaterUsage');

// Log water usage
router.post('/log', async (req, res) => {
  try {
    const { userId, activities } = req.body;
    
    const waterUsage = new WaterUsage({
      userId,
      activities
    });

    await waterUsage.save();
    res.status(201).json(waterUsage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get daily usage
router.get('/daily/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { date } = req.query;
    
    const query = { userId };
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      query.date = { $gte: startDate, $lte: endDate };
    }

    const usage = await WaterUsage.find(query).sort({ date: -1 });
    res.json(usage);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get weekly report
router.get('/weekly/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate } = req.query;

    const start = startDate ? new Date(startDate) : new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 7);

    const usage = await WaterUsage.find({
      userId,
      date: { $gte: start, $lt: end }
    }).sort({ date: 1 });

    // Calculate weekly statistics
    const weeklyStats = {
      totalUsage: usage.reduce((sum, day) => sum + day.totalLitres, 0),
      averageDailyUsage: usage.length ? 
        usage.reduce((sum, day) => sum + day.totalLitres, 0) / usage.length : 0,
      daysUnderTarget: usage.filter(day => day.targetAchieved).length,
      dailyBreakdown: usage.map(day => ({
        date: day.date,
        totalLitres: day.totalLitres,
        targetAchieved: day.targetAchieved
      }))
    };

    res.json(weeklyStats);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get activity breakdown
router.get('/activities/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;

    const query = { userId };
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const usage = await WaterUsage.find(query);
    
    // Calculate activity breakdown
    const activityBreakdown = usage.reduce((acc, day) => {
      day.activities.forEach(activity => {
        if (!acc[activity.type]) {
          acc[activity.type] = 0;
        }
        acc[activity.type] += activity.litres;
      });
      return acc;
    }, {});

    res.json(activityBreakdown);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 