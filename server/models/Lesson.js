const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['info', 'video', 'quiz'],
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  order: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ['water_conservation', 'water_scarcity', 'sustainable_practices', 'sdg_goals'],
    required: true
  },
  quizQuestions: [{
    question: String,
    options: [String],
    correctAnswer: Number
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Lesson', lessonSchema); 