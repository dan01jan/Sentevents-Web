import React, { useState, useEffect } from 'react';
import axios from 'axios';
import QuestionList from './QuestionList';

const QuestionCreate = () => {
  const [question, setQuestion] = useState('');
  const [traits, setTraits] = useState([]);
  const [selectedTrait, setSelectedTrait] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTraits = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/v1/traits/');
        setTraits(response.data);
      } catch (err) {
        console.error('Error fetching traits:', err);
      }
    };

    fetchTraits();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!question || !selectedTrait) {
      setError('All fields are required');
      return;
    }

    try {
      // Automatically set scale to 1 (or any value between 1-5)
      const scale = 1; 

      const response = await axios.post('http://localhost:4000/api/v1/questions/create-question', { question, scale, traitId: selectedTrait });
      setMessage('Question created successfully');
      setQuestion('');
      setSelectedTrait('');
    } catch (err) {
      setError(err.response?.data || 'Error creating question');
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-900 py-8 px-4">
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Create Question</h2>
      {message && <p className="text-green-600 mb-4">{message}</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="question"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Question
          </label>
          <input
            type="text"
            id="question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter question"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="trait"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Select Trait
          </label>
          <select
            id="trait"
            value={selectedTrait}
            onChange={(e) => setSelectedTrait(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a trait</option>
            {traits.map((trait) => (
              <option key={trait._id} value={trait._id}>
                {trait.trait}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
        >
          Create Question
        </button>
      </form>
    </div>
    <div className="mt-10 px-6 py-8 max-w-6xl mx-auto bg-white shadow-xl rounded-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Questions Overview</h2>
        <QuestionList />
    </div>
  </div>
  );
};

export default QuestionCreate;
