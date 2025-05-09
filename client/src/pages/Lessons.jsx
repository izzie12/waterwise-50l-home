import { useState, useEffect } from 'react';

function Lessons({ user }) {
  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/lessons', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch lessons');
      }

      setLessons(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLessonClick = async (lessonId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/lessons/${lessonId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch lesson details');
      }

      setCurrentLesson(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCompleteLesson = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/lessons/${currentLesson._id}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to mark lesson as complete');
      }

      setCurrentLesson(null);
      fetchLessons();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {currentLesson ? (
        <div className="card">
          <button
            onClick={() => setCurrentLesson(null)}
            className="text-primary-600 hover:text-primary-700 mb-4"
          >
            ← Back to Lessons
          </button>

          <h2 className="text-2xl font-bold text-gray-800 mb-4">{currentLesson.title}</h2>
          
          <div className="prose max-w-none mb-8">
            {currentLesson.content}
          </div>

          {!currentLesson.completed && (
            <button
              onClick={handleCompleteLesson}
              className="btn btn-primary"
            >
              Mark as Complete
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">Water Conservation Lessons</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {lessons.map((lesson) => (
              <div
                key={lesson._id}
                className="card cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleLessonClick(lesson._id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">{lesson.title}</h3>
                  {lesson.completed && (
                    <span className="text-green-600">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-4">{lesson.description}</p>
                <div className="flex items-center text-sm text-gray-500">
                  <span>Duration: {lesson.duration} minutes</span>
                  {lesson.completed && (
                    <span className="ml-4 text-green-600">Completed</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Lessons; 