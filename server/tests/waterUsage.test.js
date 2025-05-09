const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');
const User = require('../models/User');
const WaterUsage = require('../models/WaterUsage');
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
  await WaterUsage.deleteMany({});
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
});

describe('Water Usage Routes', () => {
  describe('POST /api/water-usage', () => {
    it('should create a new water usage log', async () => {
      const usageData = {
        date: new Date().toISOString(),
        showerUsage: 50,
        toiletUsage: 30,
        washingMachineUsage: 40,
        dishwasherUsage: 20,
        gardenUsage: 10,
        otherUsage: 0,
        notes: 'Test log'
      };

      const response = await request(app)
        .post('/api/water-usage')
        .set('Authorization', `Bearer ${authToken}`)
        .send(usageData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('totalLitres');
      expect(response.body.user).toBe(testUser._id.toString());
    });

    it('should not create a log without authentication', async () => {
      const response = await request(app)
        .post('/api/water-usage')
        .send({});

      expect(response.status).toBe(401);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/water-usage')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/water-usage/stats', () => {
    beforeEach(async () => {
      // Create some test water usage logs
      await WaterUsage.create([
        {
          user: testUser._id,
          date: new Date(),
          showerUsage: 50,
          toiletUsage: 30,
          washingMachineUsage: 40,
          dishwasherUsage: 20,
          gardenUsage: 10,
          otherUsage: 0,
          totalLitres: 150,
          notes: 'Test log 1'
        },
        {
          user: testUser._id,
          date: new Date(Date.now() - 86400000), // Yesterday
          showerUsage: 60,
          toiletUsage: 35,
          washingMachineUsage: 45,
          dishwasherUsage: 25,
          gardenUsage: 15,
          otherUsage: 0,
          totalLitres: 180,
          notes: 'Test log 2'
        }
      ]);
    });

    it('should get water usage statistics', async () => {
      const response = await request(app)
        .get('/api/water-usage/stats')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('dailyUsage');
      expect(response.body).toHaveProperty('weeklyUsage');
      expect(response.body).toHaveProperty('monthlyUsage');
      expect(response.body).toHaveProperty('targetAchievement');
    });

    it('should not get stats without authentication', async () => {
      const response = await request(app)
        .get('/api/water-usage/stats');

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/water-usage/recent', () => {
    beforeEach(async () => {
      // Create some test water usage logs
      await WaterUsage.create([
        {
          user: testUser._id,
          date: new Date(),
          showerUsage: 50,
          toiletUsage: 30,
          washingMachineUsage: 40,
          dishwasherUsage: 20,
          gardenUsage: 10,
          otherUsage: 0,
          totalLitres: 150,
          notes: 'Test log 1'
        },
        {
          user: testUser._id,
          date: new Date(Date.now() - 86400000), // Yesterday
          showerUsage: 60,
          toiletUsage: 35,
          washingMachineUsage: 45,
          dishwasherUsage: 25,
          gardenUsage: 15,
          otherUsage: 0,
          totalLitres: 180,
          notes: 'Test log 2'
        }
      ]);
    });

    it('should get recent water usage logs', async () => {
      const response = await request(app)
        .get('/api/water-usage/recent')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body[0]).toHaveProperty('totalLitres');
      expect(response.body[0]).toHaveProperty('date');
    });

    it('should not get recent logs without authentication', async () => {
      const response = await request(app)
        .get('/api/water-usage/recent');

      expect(response.status).toBe(401);
    });
  });
}); 