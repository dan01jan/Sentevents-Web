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

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/v1/events');
        const eventNames = response.data.map((event) => ({
          text: event.name,
          value: Math.floor(Math.random() * 100) + 10,
        }));
        setWords(eventNames);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      <div className="w-full h-full p-4">
        {words.length > 0 ? (
          <WordCloud words={words} options={options} />
        ) : (
          <p>Loading events...</p>
        )}
      </div>
    </div>
  );
};

export default Cloud;
