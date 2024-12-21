import React, { useState } from 'react';
import axios from 'axios';

const TraitCreate = () => {
  const [trait, setTrait] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!trait) {
      setError('Trait name is required');
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/api/v1/traits/create-trait', { trait });
      setMessage(response.data.message);
      setTrait('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating trait');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Create Trait</h2>
      {message && <p className="text-green-600 mb-4">{message}</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="trait"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Trait Name
          </label>
          <input
            type="text"
            id="trait"
            value={trait}
            onChange={(e) => setTrait(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter trait name"
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
        >
          Create Trait
        </button>
      </form>
    </div>
  );
};

export default TraitCreate;
