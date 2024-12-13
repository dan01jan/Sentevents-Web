import React from 'react';
import { Bar, Line, Radar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, RadialLinearScale } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, RadialLinearScale);

const cardData = [
  {
    id: 1,
    title: 'Sentiment Analysis',
    type: 'bar',
    data: {
      labels: ['Positive', 'Negative', 'Neutral'],
      datasets: [
        {
          label: 'Sentiments',
          data: [12, 19, 8], // Example data for sentiments
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)',
            'rgba(255, 99, 132, 0.6)',
            'rgba(153, 102, 255, 0.6)',
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(153, 102, 255, 1)',
          ],
          borderWidth: 1,
        },
      ],
    },
  },
  {
    id: 2,
    title: 'OCEAN Model Analysis',
    type: 'radar',
    data: {
      labels: ['Openness', 'Conscientiousness', 'Extraversion', 'Agreeableness', 'Neuroticism'],
      datasets: [
        {
          label: 'Personality Traits',
          data: [70, 85, 60, 75, 50], // Example data for personality traits
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          pointBackgroundColor: 'rgba(54, 162, 235, 1)',
        },
      ],
    },
  },
];

const CardSection = () => {
  return (
    <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-900 py-8 px-4">
      <h2 className="text-4xl font-bold mb-8 text-center text-gray-800 dark:text-white">Sentiment and OCEAN Model Analysis</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {cardData.map((card) => (
          <div key={card.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col justify-between h-full">
            <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">{card.title}</h3>
            <div className="h-80 mb-6">
              {card.type === 'bar' && <Bar data={card.data} options={{ responsive: true, maintainAspectRatio: false }} />}
              {card.type === 'radar' && <Radar data={card.data} options={{ responsive: true, maintainAspectRatio: false }} />}
              {card.type === 'line' && <Line data={card.data} options={{ responsive: true, maintainAspectRatio: false }} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardSection;
