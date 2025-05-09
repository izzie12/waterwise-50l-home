const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const User = require('../models/User');
const Notification = require('../models/Notification');
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
  await Notification.deleteMany({});
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

  // Create test notifications
  await Notification.create([
    {
      user: testUser._id,
      title: 'Water Usage Alert',
      message: 'Your water usage is above average today',
      type: 'alert',
      read: false
    },
    {
      user: testUser._id,
      title: 'Lesson Reminder',
      message: 'Complete your daily water conservation lesson',
      type: 'reminder',
      read: true
    }
  ]);
});

describe('Notifications Routes', () => {
  describe('GET /api/notifications', () => {
    it('should get all notifications for user', async () => {
      const response = await request(app)
        .get('/api/notifications')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body[0]).toHaveProperty('title');
      expect(response.body[0]).toHaveProperty('message');
      expect(response.body[0]).toHaveProperty('type');
      expect(response.body[0]).toHaveProperty('read');
    });

    it('should not get notifications without authentication', async () => {
      const response = await request(app)
        .get('/api/notifications');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/notifications', () => {
    it('should create a new notification', async () => {
      const notificationData = {
        title: 'New Achievement',
        message: 'You have completed 5 lessons!',
        type: 'achievement'
      };

      const response = await request(app)
        .post('/api/notifications')
        .set('Authorization', `Bearer ${authToken}`)
        .send(notificationData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('title', notificationData.title);
      expect(response.body).toHaveProperty('message', notificationData.message);
      expect(response.body).toHaveProperty('type', notificationData.type);
      expect(response.body).toHaveProperty('read', false);
    });

    it('should not create notification without authentication', async () => {
      const response = await request(app)
        .post('/api/notifications')
        .send({});

      expect(response.status).toBe(401);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/notifications')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      expect(response.status).toBe(400);
    });
  });

  describe('PATCH /api/notifications/:id/read', () => {
    it('should mark a notification as read', async () => {
      const notifications = await Notification.find();
      const notificationId = notifications[0]._id;

      const response = await request(app)
        .patch(`/api/notifications/${notificationId}/read`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('read', true);
    });

    it('should return 404 for non-existent notification', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .patch(`/api/notifications/${nonExistentId}/read`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });

    it('should not mark notification as read without authentication', async () => {
      const notifications = await Notification.find();
      const notificationId = notifications[0]._id;

      const response = await request(app)
        .patch(`/api/notifications/${notificationId}/read`);

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /api/notifications/:id', () => {
    it('should delete a notification', async () => {
      const notifications = await Notification.find();
      const notificationId = notifications[0]._id;

      const response = await request(app)
        .delete(`/api/notifications/${notificationId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      
      // Verify notification is deleted
      const deletedNotification = await Notification.findById(notificationId);
      expect(deletedNotification).toBeNull();
    });

    it('should return 404 for non-existent notification', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();

      const response = await request(app)
        .delete(`/api/notifications/${nonExistentId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });

    it('should not delete notification without authentication', async () => {
      const notifications = await Notification.find();
      const notificationId = notifications[0]._id;

      const response = await request(app)
        .delete(`/api/notifications/${notificationId}`);

      expect(response.status).toBe(401);
    });
  });
}); 