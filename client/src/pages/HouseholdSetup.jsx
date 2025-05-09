import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function HouseholdSetup({ user }) {
  const [formData, setFormData] = useState({
    householdSize: 1,
    waterSource: 'mains',
    hasGarden: false,
    gardenSize: 0,
    hasSwimmingPool: false,
    poolSize: 0
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/users/household', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to save household information');
      }

      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Set Up Your Household</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="householdSize" className="block text-sm font-medium text-gray-700">
              Number of People in Household
            </label>
            <input
              type="number"
              id="householdSize"
              name="householdSize"
              min="1"
              value={formData.householdSize}
              onChange={handleChange}
              className="input mt-1"
              required
            />
          </div>

          <div>
            <label htmlFor="waterSource" className="block text-sm font-medium text-gray-700">
              Primary Water Source
            </label>
            <select
              id="waterSource"
              name="waterSource"
              value={formData.waterSource}
              onChange={handleChange}
              className="input mt-1"
              required
            >
              <option value="mains">Mains Water</option>
              <option value="well">Well Water</option>
              <option value="rainwater">Rainwater Collection</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="hasGarden"
              name="hasGarden"
              checked={formData.hasGarden}
              onChange={handleChange}
              className="h-4 w-4 text-primary-600"
            />
            <label htmlFor="hasGarden" className="ml-2 block text-sm text-gray-700">
              Do you have a garden?
            </label>
          </div>

          {formData.hasGarden && (
            <div>
              <label htmlFor="gardenSize" className="block text-sm font-medium text-gray-700">
                Garden Size (square meters)
              </label>
              <input
                type="number"
                id="gardenSize"
                name="gardenSize"
                min="0"
                value={formData.gardenSize}
                onChange={handleChange}
                className="input mt-1"
                required
              />
            </div>
          )}

          <div className="flex items-center">
            <input
              type="checkbox"
              id="hasSwimmingPool"
              name="hasSwimmingPool"
              checked={formData.hasSwimmingPool}
              onChange={handleChange}
              className="h-4 w-4 text-primary-600"
            />
            <label htmlFor="hasSwimmingPool" className="ml-2 block text-sm text-gray-700">
              Do you have a swimming pool?
            </label>
          </div>

          {formData.hasSwimmingPool && (
            <div>
              <label htmlFor="poolSize" className="block text-sm font-medium text-gray-700">
                Pool Size (cubic meters)
              </label>
              <input
                type="number"
                id="poolSize"
                name="poolSize"
                min="0"
                value={formData.poolSize}
                onChange={handleChange}
                className="input mt-1"
                required
              />
            </div>
          )}

          <button type="submit" className="btn btn-primary w-full">
            Save and Continue
          </button>
        </form>
      </div>
    </div>
  );
}

export default HouseholdSetup; 