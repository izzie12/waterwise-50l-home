import { mockUser, mockWaterUsage, mockRecentLogs, mockLessons } from './mockData';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Auth service
export const authService = {
  login: async (credentials) => {
    await delay(500); // Simulate network delay
    if (credentials.email === 'john@example.com' && credentials.password === 'password') {
      return {
        user: mockUser,
        token: 'mock-jwt-token'
      };
    }
    throw new Error('Invalid credentials');
  },

  register: async (userData) => {
    await delay(500);
    return {
      user: { ...mockUser, ...userData },
      token: 'mock-jwt-token'
    };
  }
};

// Water usage service
export const waterUsageService = {
  getStats: async () => {
    await delay(500);
    return mockWaterUsage;
  },

  getRecentLogs: async () => {
    await delay(500);
    return mockRecentLogs;
  },

  logWaterUsage: async (usageData) => {
    await delay(500);
    const newLog = {
      _id: Date.now().toString(),
      date: usageData.date,
      ...usageData,
      totalLitres: Object.entries(usageData)
        .filter(([key]) => key.includes('Usage'))
        .reduce((sum, [_, value]) => sum + (value || 0), 0)
    };
    mockRecentLogs.unshift(newLog);
    return newLog;
  }
};

// Lessons service
export const lessonsService = {
  getLessons: async () => {
    await delay(500);
    return mockLessons;
  },

  getLesson: async (lessonId) => {
    await delay(500);
    const lesson = mockLessons.find(l => l._id === lessonId);
    if (!lesson) throw new Error('Lesson not found');
    return lesson;
  },

  completeLesson: async (lessonId) => {
    await delay(500);
    const lesson = mockLessons.find(l => l._id === lessonId);
    if (!lesson) throw new Error('Lesson not found');
    lesson.completed = true;
    return lesson;
  }
};

// User service
export const userService = {
  updateHousehold: async (householdData) => {
    await delay(500);
    mockUser.household = { ...mockUser.household, ...householdData };
    return mockUser;
  }
}; 