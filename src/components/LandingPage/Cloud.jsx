import React, { useEffect, useState } from 'react';
import WordCloud from 'react-wordcloud';
import axios from 'axios';

const options = {
  rotations: 2,
  rotationAngles: [-90, 0],
  fontFamily: 'Arial, sans-serif',
  fontWeight: 'bold',
  color: 'random-light',
  minSize: 10,
  maxSize: 100,
};

const Cloud = () => {
  const [words, setWords] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/v1/events');
        console.log('API Response:', response.data); // Log the response
        if (response.data && Array.isArray(response.data.data)) {
          const eventNames = response.data.data.map((event) => ({
            text: event.name,
            value: Math.floor(Math.random() * 100) + 10,
          }));
          setWords(eventNames);
        } else {
          setError('Unexpected data format from API');
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        setError(error.message || 'Failed to fetch events');
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      <div className="w-full h-full p-4">
        {error ? (
          <p>Error: {error}</p>
        ) : words.length > 0 ? (
          <WordCloud words={words} options={options} />
        ) : (
          <p>Loading events...</p>
        )}
      </div>
    </div>
  );
};

export default Cloud;
