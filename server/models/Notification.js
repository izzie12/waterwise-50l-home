const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['water_usage', 'lesson_reminder', 'achievement', 'tip', 'system'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  actionUrl: {
    type: String,
    // Optional URL to redirect when notification is clicked
  },
  expiresAt: {
    type: Date,
    // Optional expiration date for the notification
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema); 