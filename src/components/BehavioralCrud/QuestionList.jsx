import React, { useState, useEffect } from 'react';
import axios from 'axios';

const QuestionList = () => {
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/v1/questions/');
        setQuestions(response.data);
      } catch (err) {
        setError('Error fetching questions: ' + err.message);
      }
    };

    fetchQuestions();
  }, []);

  return (
    <div>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        {questions.length === 0 && !error ? (
            <p className="text-gray-600">No questions available</p>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(
                questions.reduce((acc, question) => {
                const traitName = question.traitId?.trait || 'Unknown Trait';
                if (!acc[traitName]) acc[traitName] = [];
                acc[traitName].push(question);
                return acc;
                }, {})
            ).map(([traitName, questions]) => (
                <div key={traitName} className="bg-gray-50 p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">{traitName}</h3>
                <ul className="space-y-2">
                    {questions.map((q) => (
                    <li key={q._id} className="p-2 bg-gray-100 rounded-md shadow-sm">
                        {q.question}
                    </li>
                    ))}
                </ul>
                </div>
            ))}
            </div>
        )}
    </div>

  );
};

export default QuestionList;
