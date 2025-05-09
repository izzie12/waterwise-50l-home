const express = require('express');
const router = express.Router();
const Lesson = require('../models/Lesson');
const UserProgress = require('../models/UserProgress');

// Get all lessons
router.get('/lessons', async (req, res) => {
  try {
    const lessons = await Lesson.find().sort({ order: 1 });
    res.json(lessons);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get lesson by ID
router.get('/lessons/:id', async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }
    res.json(lesson);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get user progress
router.get('/progress/:userId', async (req, res) => {
  try {
    let progress = await UserProgress.findOne({ userId: req.params.userId });
    
    if (!progress) {
      // Create new progress if none exists
      progress = new UserProgress({
        userId: req.params.userId,
        completedLessons: [],
        totalProgress: 0
      });
      await progress.save();
    }

    // Get all lessons to calculate progress
    const totalLessons = await Lesson.countDocuments();
    progress.totalProgress = (progress.completedLessons.length / totalLessons) * 100;
    await progress.save();

    res.json(progress);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Mark lesson as completed
router.post('/complete/:userId/:lessonId', async (req, res) => {
  try {
    const { userId, lessonId } = req.params;
    const { quizScore } = req.body;

    let progress = await UserProgress.findOne({ userId });
    
    if (!progress) {
      progress = new UserProgress({ userId });
    }

    // Check if lesson is already completed
    const alreadyCompleted = progress.completedLessons.some(
      lesson => lesson.lessonId.toString() === lessonId
    );

    if (!alreadyCompleted) {
      progress.completedLessons.push({
        lessonId,
        quizScore: quizScore || null
      });
    }

    // Update current lesson to next uncompleted lesson
    const allLessons = await Lesson.find().sort({ order: 1 });
    const completedLessonIds = progress.completedLessons.map(l => l.lessonId.toString());
    const nextLesson = allLessons.find(lesson => !completedLessonIds.includes(lesson._id.toString()));
    
    if (nextLesson) {
      progress.currentLesson = nextLesson._id;
    }

    await progress.save();
    res.json(progress);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get next lesson for user
router.get('/next-lesson/:userId', async (req, res) => {
  try {
    const progress = await UserProgress.findOne({ userId: req.params.userId });
    
    if (!progress || !progress.currentLesson) {
      // If no progress, return first lesson
      const firstLesson = await Lesson.findOne().sort({ order: 1 });
      return res.json(firstLesson);
    }

    const nextLesson = await Lesson.findById(progress.currentLesson);
    res.json(nextLesson);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 