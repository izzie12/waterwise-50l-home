const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const User = require('../models/User');
const Lesson = require('../models/Lesson');
const jwt = require('jsonwebtoken');

let mongoServer;
let testUser;
let authToken;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Lesson.deleteMany({});
  await User.deleteMany({});

  // Create a test user
  testUser = await User.create({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  });

  // Generate auth token
  authToken = jwt.sign(
    { userId: testUser._id },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '1h' }
  );

  // Create test lessons
  await Lesson.create([
    {
      title: 'Water Conservation Basics',
      content: 'Learn about basic water conservation techniques...',
      category: 'basics',
      order: 1,
      duration: 15,
      points: 100
    },
    {
      title: 'Advanced Water Saving',
      content: 'Advanced techniques for water conservation...',
      category: 'advanced',
      order: 2,
      duration: 20,
      points: 150
    }
  ]);
});

describe('Lessons Routes', () => {
  describe('GET /api/lessons', () => {
    it('should get all lessons', async () => {
      const response = await request(app)
        .get('/api/lessons')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body[0]).toHaveProperty('title');
      expect(response.body[0]).toHaveProperty('category');
    });

    it('should not get lessons without authentication', async () => {
      const response = await request(app)
        .get('/api/lessons');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/lessons/:id', () => {
    it('should get a specific lesson', async () => {
      const lessons = await Lesson.find();
      const lessonId = lessons[0]._id;

      const response = await request(app)
        .get(`/api/lessons/${lessonId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('title', 'Water Conservation Basics');
      expect(response.body).toHaveProperty('content');
      expect(response.body).toHaveProperty('category', 'basics');
    });

    it('should return 404 for non-existent lesson', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .get(`/api/lessons/${nonExistentId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });

    it('should not get lesson without authentication', async () => {
      const lessons = await Lesson.find();
      const lessonId = lessons[0]._id;

      const response = await request(app)
        .get(`/api/lessons/${lessonId}`);

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/lessons/:id/complete', () => {
    it('should mark a lesson as complete', async () => {
      const lessons = await Lesson.find();
      const lessonId = lessons[0]._id;

      const response = await request(app)
        .post(`/api/lessons/${lessonId}/complete`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('completed');
      expect(response.body.completed).toBe(true);
    });

    it('should return 404 for non-existent lesson', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .post(`/api/lessons/${nonExistentId}/complete`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });

    it('should not mark lesson as complete without authentication', async () => {
      const lessons = await Lesson.find();
      const lessonId = lessons[0]._id;

      const response = await request(app)
        .post(`/api/lessons/${lessonId}/complete`);

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/lessons/progress', () => {
    it('should get user progress', async () => {
      const response = await request(app)
        .get('/api/lessons/progress')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('completedLessons');
      expect(response.body).toHaveProperty('totalLessons');
      expect(response.body).toHaveProperty('progress');
    });

    it('should not get progress without authentication', async () => {
      const response = await request(app)
        .get('/api/lessons/progress');

      expect(response.status).toBe(401);
    });
  });
}); 