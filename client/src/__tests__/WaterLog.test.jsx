import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import WaterLog from '../pages/WaterLog';
import { waterUsageService } from '../services/mockService';

// Mock the waterUsageService
jest.mock('../services/mockService', () => ({
  waterUsageService: {
    logWaterUsage: jest.fn(),
    getRecentLogs: jest.fn()
  }
}));

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
    otherUsage: 0,
    notes: 'Test log 1'
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
    otherUsage: 0,
    notes: 'Test log 2'
  }
];

const renderWaterLog = () => {
  return render(
    <BrowserRouter>
      <WaterLog />
    </BrowserRouter>
  );
};

describe('WaterLog Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    waterUsageService.getRecentLogs.mockResolvedValue(mockRecentLogs);
  });

  it('renders water log form correctly', () => {
    renderWaterLog();
    
    // Check if all form elements are present
    expect(screen.getByLabelText(/shower usage/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/toilet usage/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/washing machine usage/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/dishwasher usage/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/garden usage/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/other usage/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/notes/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log water usage/i })).toBeInTheDocument();
  });

  it('handles form submission correctly', async () => {
    const mockLogResponse = {
      id: '3',
      date: '2024-03-16',
      totalLitres: 200,
      showerUsage: 70,
      toiletUsage: 40,
      washingMachineUsage: 50,
      dishwasherUsage: 30,
      gardenUsage: 10,
      otherUsage: 0,
      notes: 'Test log 3'
    };

    waterUsageService.logWaterUsage.mockResolvedValueOnce(mockLogResponse);

    renderWaterLog();

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/shower usage/i), {
      target: { value: '70' }
    });
    fireEvent.change(screen.getByLabelText(/toilet usage/i), {
      target: { value: '40' }
    });
    fireEvent.change(screen.getByLabelText(/washing machine usage/i), {
      target: { value: '50' }
    });
    fireEvent.change(screen.getByLabelText(/dishwasher usage/i), {
      target: { value: '30' }
    });
    fireEvent.change(screen.getByLabelText(/garden usage/i), {
      target: { value: '10' }
    });
    fireEvent.change(screen.getByLabelText(/other usage/i), {
      target: { value: '0' }
    });
    fireEvent.change(screen.getByLabelText(/notes/i), {
      target: { value: 'Test log 3' }
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /log water usage/i }));

    // Wait for the log service to be called
    await waitFor(() => {
      expect(waterUsageService.logWaterUsage).toHaveBeenCalledWith({
        showerUsage: 70,
        toiletUsage: 40,
        washingMachineUsage: 50,
        dishwasherUsage: 30,
        gardenUsage: 10,
        otherUsage: 0,
        notes: 'Test log 3'
      });
    });
  });

  it('displays recent water logs correctly', async () => {
    renderWaterLog();

    await waitFor(() => {
      expect(screen.getByText(/recent water logs/i)).toBeInTheDocument();
    });

    // Check if both logs are displayed
    expect(screen.getByText('2024-03-15')).toBeInTheDocument();
    expect(screen.getByText('2024-03-14')).toBeInTheDocument();
    expect(screen.getByText('150L')).toBeInTheDocument();
    expect(screen.getByText('180L')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    renderWaterLog();

    // Submit the form without filling in fields
    fireEvent.click(screen.getByRole('button', { name: /log water usage/i }));

    // Check for validation messages
    expect(screen.getByText(/shower usage is required/i)).toBeInTheDocument();
    expect(screen.getByText(/toilet usage is required/i)).toBeInTheDocument();
    expect(screen.getByText(/washing machine usage is required/i)).toBeInTheDocument();
    expect(screen.getByText(/dishwasher usage is required/i)).toBeInTheDocument();
    expect(screen.getByText(/garden usage is required/i)).toBeInTheDocument();
  });

  it('validates numeric input fields', async () => {
    renderWaterLog();

    // Enter non-numeric values
    fireEvent.change(screen.getByLabelText(/shower usage/i), {
      target: { value: 'abc' }
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /log water usage/i }));

    // Check for validation message
    expect(screen.getByText(/shower usage must be a number/i)).toBeInTheDocument();
  });

  it('handles error state when logging water usage fails', async () => {
    const errorMessage = 'Failed to log water usage';
    waterUsageService.logWaterUsage.mockRejectedValueOnce(new Error(errorMessage));

    renderWaterLog();

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/shower usage/i), {
      target: { value: '70' }
    });
    fireEvent.change(screen.getByLabelText(/toilet usage/i), {
      target: { value: '40' }
    });
    fireEvent.change(screen.getByLabelText(/washing machine usage/i), {
      target: { value: '50' }
    });
    fireEvent.change(screen.getByLabelText(/dishwasher usage/i), {
      target: { value: '30' }
    });
    fireEvent.change(screen.getByLabelText(/garden usage/i), {
      target: { value: '10' }
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /log water usage/i }));

    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
}); 