import { useState, useEffect } from 'react';

function WaterLog({ user }) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    showerUsage: 0,
    toiletUsage: 0,
    washingMachineUsage: 0,
    dishwasherUsage: 0,
    gardenUsage: 0,
    otherUsage: 0,
    notes: ''
  });
  const [recentLogs, setRecentLogs] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchRecentLogs();
  }, []);

  const fetchRecentLogs = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/water-usage/recent', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch recent logs');
      }

      setRecentLogs(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const calculateTotal = () => {
    return Object.entries(formData)
      .filter(([key]) => key.includes('Usage'))
      .reduce((sum, [_, value]) => sum + (value || 0), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5000/api/water-usage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...formData,
          totalLitres: calculateTotal()
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to log water usage');
      }

      setSuccess('Water usage logged successfully!');
      setFormData({
        date: new Date().toISOString().split('T')[0],
        showerUsage: 0,
        toiletUsage: 0,
        washingMachineUsage: 0,
        dishwasherUsage: 0,
        gardenUsage: 0,
        otherUsage: 0,
        notes: ''
      });
      fetchRecentLogs();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="card">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Log Water Usage</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="input mt-1"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="showerUsage" className="block text-sm font-medium text-gray-700">
                Shower Usage (L)
              </label>
              <input
                type="number"
                id="showerUsage"
                name="showerUsage"
                min="0"
                step="0.1"
                value={formData.showerUsage}
                onChange={handleChange}
                className="input mt-1"
              />
            </div>

            <div>
              <label htmlFor="toiletUsage" className="block text-sm font-medium text-gray-700">
                Toilet Usage (L)
              </label>
              <input
                type="number"
                id="toiletUsage"
                name="toiletUsage"
                min="0"
                step="0.1"
                value={formData.toiletUsage}
                onChange={handleChange}
                className="input mt-1"
              />
            </div>

            <div>
              <label htmlFor="washingMachineUsage" className="block text-sm font-medium text-gray-700">
                Washing Machine Usage (L)
              </label>
              <input
                type="number"
                id="washingMachineUsage"
                name="washingMachineUsage"
                min="0"
                step="0.1"
                value={formData.washingMachineUsage}
                onChange={handleChange}
                className="input mt-1"
              />
            </div>

            <div>
              <label htmlFor="dishwasherUsage" className="block text-sm font-medium text-gray-700">
                Dishwasher Usage (L)
              </label>
              <input
                type="number"
                id="dishwasherUsage"
                name="dishwasherUsage"
                min="0"
                step="0.1"
                value={formData.dishwasherUsage}
                onChange={handleChange}
                className="input mt-1"
              />
            </div>

            <div>
              <label htmlFor="gardenUsage" className="block text-sm font-medium text-gray-700">
                Garden Usage (L)
              </label>
              <input
                type="number"
                id="gardenUsage"
                name="gardenUsage"
                min="0"
                step="0.1"
                value={formData.gardenUsage}
                onChange={handleChange}
                className="input mt-1"
              />
            </div>

            <div>
              <label htmlFor="otherUsage" className="block text-sm font-medium text-gray-700">
                Other Usage (L)
              </label>
              <input
                type="number"
                id="otherUsage"
                name="otherUsage"
                min="0"
                step="0.1"
                value={formData.otherUsage}
                onChange={handleChange}
                className="input mt-1"
              />
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="input mt-1"
              rows="3"
            />
          </div>

          <div className="text-right">
            <p className="text-lg font-semibold text-gray-700">
              Total Usage: {calculateTotal()}L
            </p>
          </div>

          <button type="submit" className="btn btn-primary w-full">
            Log Water Usage
          </button>
        </form>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Logs</h2>
        {recentLogs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Usage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentLogs.map((log) => (
                  <tr key={log._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(log.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {log.totalLitres}L
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {log.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No recent logs found</p>
        )}
      </div>
    </div>
  );
}

export default WaterLog; 