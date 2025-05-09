import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import { waterUsageService } from '../services/mockService';

// Mock the waterUsageService
jest.mock('../services/mockService', () => ({
  waterUsageService: {
    getStats: jest.fn(),
    getRecentLogs: jest.fn()
  }
}));

const mockStats = {
  dailyUsage: 150,
  weeklyUsage: 1050,
  monthlyUsage: 4500,
  targetAchievement: 75
};

const mockRecentLogs = [
  {
    id: '1',
    date: '2024-03-15',
    totalLitres: 150,
    showerUsage: 50,
    toiletUsage: 30,
    washingMachineUsage: 40,
    dishwasherUsage: 20,
    gardenUsage: 10,
    otherUsage: 0
  },
  {
    id: '2',
    date: '2024-03-14',
    totalLitres: 180,
    showerUsage: 60,
    toiletUsage: 35,
    washingMachineUsage: 45,
    dishwasherUsage: 25,
    gardenUsage: 15,
    otherUsage: 0
  }
];

const renderDashboard = () => {
  return render(
    <BrowserRouter>
      <Dashboard />
    </BrowserRouter>
  );
};

describe('Dashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    waterUsageService.getStats.mockResolvedValue(mockStats);
    waterUsageService.getRecentLogs.mockResolvedValue(mockRecentLogs);
  });

  it('renders dashboard with loading state initially', () => {
    renderDashboard();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('displays water usage statistics correctly', async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText(/daily usage/i)).toBeInTheDocument();
      expect(screen.getByText(/weekly usage/i)).toBeInTheDocument();
      expect(screen.getByText(/monthly usage/i)).toBeInTheDocument();
      expect(screen.getByText(/target achievement/i)).toBeInTheDocument();
    });

    expect(screen.getByText('150L')).toBeInTheDocument();
    expect(screen.getByText('1050L')).toBeInTheDocument();
    expect(screen.getByText('4500L')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('displays recent water logs correctly', async () => {
    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText(/recent water logs/i)).toBeInTheDocument();
    });

    // Check if both logs are displayed
    expect(screen.getByText('2024-03-15')).toBeInTheDocument();
    expect(screen.getByText('2024-03-14')).toBeInTheDocument();
    expect(screen.getByText('150L')).toBeInTheDocument();
    expect(screen.getByText('180L')).toBeInTheDocument();
  });

  it('handles error state when fetching stats fails', async () => {
    const errorMessage = 'Failed to fetch water usage statistics';
    waterUsageService.getStats.mockRejectedValueOnce(new Error(errorMessage));

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('handles error state when fetching recent logs fails', async () => {
    const errorMessage = 'Failed to fetch recent water logs';
    waterUsageService.getRecentLogs.mockRejectedValueOnce(new Error(errorMessage));

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('displays empty state when no recent logs are available', async () => {
    waterUsageService.getRecentLogs.mockResolvedValueOnce([]);

    renderDashboard();

    await waitFor(() => {
      expect(screen.getByText(/no recent water logs/i)).toBeInTheDocument();
    });
  });
}); 