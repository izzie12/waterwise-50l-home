import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Dashboard({ user }) {
  const [stats, setStats] = useState({
    dailyUsage: 0,
    weeklyUsage: 0,
    monthlyUsage: 0,
    targetAchievement: 0,
    lastLogDate: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/water-usage/stats', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch statistics');
        }

        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-white p-6">
          <h3 className="text-lg font-semibold text-gray-700">Daily Usage</h3>
          <p className="text-3xl font-bold text-primary-600">{stats.dailyUsage}L</p>
        </div>
        <div className="card bg-white p-6">
          <h3 className="text-lg font-semibold text-gray-700">Weekly Usage</h3>
          <p className="text-3xl font-bold text-primary-600">{stats.weeklyUsage}L</p>
        </div>
        <div className="card bg-white p-6">
          <h3 className="text-lg font-semibold text-gray-700">Monthly Usage</h3>
          <p className="text-3xl font-bold text-primary-600">{stats.monthlyUsage}L</p>
        </div>
        <div className="card bg-white p-6">
          <h3 className="text-lg font-semibold text-gray-700">Target Achievement</h3>
          <p className="text-3xl font-bold text-primary-600">{stats.targetAchievement}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-4">
            <Link to="/water-log" className="btn btn-primary w-full">
              Log Water Usage
            </Link>
            <Link to="/lessons" className="btn btn-secondary w-full">
              Start Learning
            </Link>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
          {stats.lastLogDate ? (
            <p className="text-gray-600">
              Last water usage logged on {new Date(stats.lastLogDate).toLocaleDateString()}
            </p>
          ) : (
            <p className="text-gray-600">No water usage logged yet</p>
          )}
        </div>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
    </div>
  );
}

export default Dashboard; 