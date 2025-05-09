import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Lessons from '../pages/Lessons';
import { lessonsService } from '../services/mockService';

// Mock the lessonsService
jest.mock('../services/mockService', () => ({
  lessonsService: {
    getLessons: jest.fn(),
    getLesson: jest.fn(),
    markLessonComplete: jest.fn(),
    getProgress: jest.fn()
  }
}));

const mockLessons = [
  {
    id: '1',
    title: 'Water Conservation Basics',
    content: 'Learn about basic water conservation techniques...',
    category: 'basics',
    order: 1,
    duration: 15,
    points: 100,
    completed: false
  },
  {
    id: '2',
    title: 'Advanced Water Saving',
    content: 'Advanced techniques for water conservation...',
    category: 'advanced',
    order: 2,
    duration: 20,
    points: 150,
    completed: true
  }
];

const mockProgress = {
  completedLessons: 1,
  totalLessons: 2,
  progress: 50
};

const renderLessons = () => {
  return render(
    <BrowserRouter>
      <Lessons />
    </BrowserRouter>
  );
};

describe('Lessons Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    lessonsService.getLessons.mockResolvedValue(mockLessons);
    lessonsService.getProgress.mockResolvedValue(mockProgress);
  });

  it('renders lessons list correctly', async () => {
    renderLessons();

    await waitFor(() => {
      expect(screen.getByText(/water conservation basics/i)).toBeInTheDocument();
      expect(screen.getByText(/advanced water saving/i)).toBeInTheDocument();
    });

    // Check if lesson details are displayed
    expect(screen.getByText(/15 minutes/i)).toBeInTheDocument();
    expect(screen.getByText(/20 minutes/i)).toBeInTheDocument();
    expect(screen.getByText(/100 points/i)).toBeInTheDocument();
    expect(screen.getByText(/150 points/i)).toBeInTheDocument();
  });

  it('displays progress information correctly', async () => {
    renderLessons();

    await waitFor(() => {
      expect(screen.getByText(/your progress/i)).toBeInTheDocument();
      expect(screen.getByText(/50%/i)).toBeInTheDocument();
      expect(screen.getByText(/1 of 2 lessons completed/i)).toBeInTheDocument();
    });
  });

  it('handles lesson completion correctly', async () => {
    lessonsService.markLessonComplete.mockResolvedValueOnce({
      ...mockLessons[0],
      completed: true
    });

    renderLessons();

    await waitFor(() => {
      expect(screen.getByText(/water conservation basics/i)).toBeInTheDocument();
    });

    // Click the complete button for the first lesson
    fireEvent.click(screen.getByRole('button', { name: /complete lesson/i }));

    // Wait for the markLessonComplete service to be called
    await waitFor(() => {
      expect(lessonsService.markLessonComplete).toHaveBeenCalledWith('1');
    });

    // Check if progress is updated
    expect(screen.getByText(/2 of 2 lessons completed/i)).toBeInTheDocument();
    expect(screen.getByText(/100%/i)).toBeInTheDocument();
  });

  it('handles error state when fetching lessons fails', async () => {
    const errorMessage = 'Failed to fetch lessons';
    lessonsService.getLessons.mockRejectedValueOnce(new Error(errorMessage));

    renderLessons();

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('handles error state when marking lesson complete fails', async () => {
    const errorMessage = 'Failed to mark lesson as complete';
    lessonsService.markLessonComplete.mockRejectedValueOnce(new Error(errorMessage));

    renderLessons();

    await waitFor(() => {
      expect(screen.getByText(/water conservation basics/i)).toBeInTheDocument();
    });

    // Click the complete button
    fireEvent.click(screen.getByRole('button', { name: /complete lesson/i }));

    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('displays empty state when no lessons are available', async () => {
    lessonsService.getLessons.mockResolvedValueOnce([]);

    renderLessons();

    await waitFor(() => {
      expect(screen.getByText(/no lessons available/i)).toBeInTheDocument();
    });
  });

  it('filters lessons by category', async () => {
    renderLessons();

    await waitFor(() => {
      expect(screen.getByText(/water conservation basics/i)).toBeInTheDocument();
    });

    // Click the basics filter
    fireEvent.click(screen.getByRole('button', { name: /basics/i }));

    // Check if only basics lessons are shown
    expect(screen.getByText(/water conservation basics/i)).toBeInTheDocument();
    expect(screen.queryByText(/advanced water saving/i)).not.toBeInTheDocument();
  });
}); 