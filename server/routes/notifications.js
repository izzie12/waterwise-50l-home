const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// Get all notifications for a user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { unreadOnly, type, limit = 20 } = req.query;

    const query = { userId };
    
    if (unreadOnly === 'true') {
      query.isRead = false;
    }

    if (type) {
      query.type = type;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json(notifications);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Mark notification as read
router.patch('/read/:notificationId', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.notificationId,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json(notification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Mark all notifications as read
router.patch('/read-all/:userId', async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.params.userId, isRead: false },
      { isRead: true }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Create a new notification
router.post('/', async (req, res) => {
  try {
    const { userId, type, title, message, priority, actionUrl, expiresAt } = req.body;

    const notification = new Notification({
      userId,
      type,
      title,
      message,
      priority,
      actionUrl,
      expiresAt
    });

    await notification.save();
    res.status(201).json(notification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a notification
router.delete('/:notificationId', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndDelete(req.params.notificationId);
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Notification deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get unread notification count
router.get('/count/:userId', async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      userId: req.params.userId,
      isRead: false
    });

    res.json({ count });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 