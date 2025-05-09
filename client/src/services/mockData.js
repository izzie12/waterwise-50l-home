// Mock user data
export const mockUser = {
  _id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  household: {
    householdSize: 3,
    waterSource: 'mains',
    hasGarden: true,
    gardenSize: 100,
    hasSwimmingPool: false,
    poolSize: 0
  }
};

// Mock water usage data
export const mockWaterUsage = {
  dailyUsage: 150,
  weeklyUsage: 1050,
  monthlyUsage: 4200,
  targetAchievement: 85,
  lastLogDate: new Date().toISOString()
};

// Mock recent water logs
export const mockRecentLogs = [
  {
    _id: '1',
    date: new Date().toISOString(),
    totalLitres: 150,
    showerUsage: 50,
    toiletUsage: 30,
    washingMachineUsage: 40,
    dishwasherUsage: 20,
    gardenUsage: 10,
    otherUsage: 0,
    notes: 'Regular daily usage'
  },
  {
    _id: '2',
    date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    totalLitres: 180,
    showerUsage: 60,
    toiletUsage: 35,
    washingMachineUsage: 45,
    dishwasherUsage: 25,
    gardenUsage: 15,
    otherUsage: 0,
    notes: 'Extra shower and garden watering'
  }
];

// Mock lessons data
export const mockLessons = [
  {
    _id: '1',
    title: 'Understanding Water Conservation',
    description: 'Learn the basics of water conservation and why it matters.',
    content: `
      <h3>Why Water Conservation Matters</h3>
      <p>Water is one of our most precious resources. Despite covering 71% of the Earth's surface, only 2.5% of it is fresh water, and less than 1% is readily available for human use.</p>
      
      <h3>Key Points:</h3>
      <ul>
        <li>Water is essential for all life forms</li>
        <li>Fresh water is a limited resource</li>
        <li>Conservation helps protect ecosystems</li>
        <li>Reducing water usage saves money</li>
      </ul>
    `,
    duration: 15,
    completed: false
  },
  {
    _id: '2',
    title: 'Efficient Water Usage at Home',
    description: 'Practical tips for reducing water consumption in your daily life.',
    content: `
      <h3>Home Water Efficiency Tips</h3>
      <p>Small changes in your daily routine can lead to significant water savings.</p>
      
      <h3>Key Tips:</h3>
      <ul>
        <li>Fix leaking taps and pipes</li>
        <li>Install water-efficient fixtures</li>
        <li>Take shorter showers</li>
        <li>Only run full loads in washing machines</li>
      </ul>
    `,
    duration: 20,
    completed: true
  },
  {
    _id: '3',
    title: 'Smart Garden Watering',
    description: 'Learn how to maintain a beautiful garden while minimizing water usage.',
    content: `
      <h3>Garden Water Conservation</h3>
      <p>Your garden can thrive while using less water with these smart techniques.</p>
      
      <h3>Key Techniques:</h3>
      <ul>
        <li>Water early morning or evening</li>
        <li>Use drip irrigation systems</li>
        <li>Choose drought-resistant plants</li>
        <li>Mulch to retain moisture</li>
      </ul>
    `,
    duration: 25,
    completed: false
  }
]; 