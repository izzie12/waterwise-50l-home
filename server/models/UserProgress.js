const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  completedLessons: [{
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
      required: true
    },
    completedAt: {
      type: Date,
      default: Date.now
    },
    quizScore: {
      type: Number,
      min: 0,
      max: 100
    }
  }],
  currentLesson: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  },
  totalProgress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  }
}, {
  timestamps: true
});

// Calculate total progress before saving
userProgressSchema.pre('save', function(next) {
  if (this.completedLessons && this.completedLessons.length > 0) {
    // Assuming there's a way to get total lessons count
    // This will be updated when we implement the progress calculation
    this.totalProgress = (this.completedLessons.length / 10) * 100; // Example calculation
  }
  next();
});

module.exports = mongoose.model('UserProgress', userProgressSchema); 