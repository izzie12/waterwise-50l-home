const mongoose = require('mongoose');

const waterUsageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  activities: [{
    type: {
      type: String,
      required: true,
      enum: ['shower', 'bath', 'washing', 'cooking', 'drinking', 'toilet', 'other']
    },
    litres: {
      type: Number,
      required: true,
      min: 0
    },
    notes: String
  }],
  totalLitres: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  targetAchieved: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Calculate total litres before validation
waterUsageSchema.pre('validate', function(next) {
  if (this.activities && this.activities.length > 0) {
    this.totalLitres = this.activities.reduce((sum, activity) => sum + activity.litres, 0);
    this.targetAchieved = this.totalLitres <= 50; // 50L target
  }
  next();
});

module.exports = mongoose.model('WaterUsage', waterUsageSchema); 