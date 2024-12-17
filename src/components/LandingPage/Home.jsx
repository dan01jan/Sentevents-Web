import React from 'react';
import weblogo from '../../assets/website/weblogo.png';
import { useState, useEffect } from 'react';
import axios from 'axios'; 

const Home = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/v1/events');

        setEvents(response.data.data.slice(0, 3)); // Get only the first 3 events
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Hero Section */}
      <section className="bg-black text-white py-16 px-8">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left md:w-1/2">
            <h1 className="text-5xl font-bold mb-4">
              Uncovering Insights from <span className="text-yellow-500">TUPT Programs</span>
            </h1>
            <p className="mb-6">
              A comprehensive look at how sentiment analysis can illuminate the opinions and feedback of members regarding organizational programs at the Technological University of the Philippines – Taguig.
            </p>
            <button className="bg-yellow-500 text-black py-2 px-4 rounded-lg mb-4 md:mb-0">Learn More</button>
            <div className="flex justify-center md:justify-start gap-4 mt-4">
              <a href="#" className="text-white">Read Our Study</a>
              <a href="#" className="text-white">Contact Us</a>
            </div>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0">
            <div className="relative">
              <img src={weblogo} alt="Analysis and Research" className="rounded-lg" />
              <div className="absolute bottom-4 right-4 bg-yellow-500 p-2 rounded-full">
                <span className="text-black">▶</span>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Latest Events Section */}
          <section className="py-16 px-8 bg-gray-200 dark:bg-gray-800">
          <div className="container mx-auto">
            <h2 className="text-4xl font-bold mb-8">Recent Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {events.map((event, index) => {
                // Log the image URL for debugging
                console.log('Event image URL:', event.images && event.images[0]);
                
                const imageUrl = event.images && event.images[0] && event.images[0].url
                  ? event.images[0].url  // Use this if the image object has a url property
                  : event.images && event.images[0]
                  ? event.images[0]  // Use this if the image is stored as a direct URL string
                  : "https://via.placeholder.com/150";

                return (
                  <div key={index} className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md">
                    <img 
                      src={imageUrl}
                      alt={event.title} 
                      className="w-full h-48 object-cover rounded-lg mb-4" 
                      onError={(e) => {
                        e.target.onerror = null; // Prevent infinite loop
                        e.target.src = "https://via.placeholder.com/150";
                      }}
                    />
                    <h3 className="text-2xl font-semibold">{event.title}</h3>
                    <p className="mt-2">{event.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      {/* Latest Post Section */}
      <section className="py-16 px-8 bg-gray-200 dark:bg-gray-800">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold mb-8">Our Latest Updates</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['Update 1', 'Update 2', 'Update 3'].map((post, index) => (
              <div key={index} className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md">
                <img src="https://via.placeholder.com/150" alt={`Post ${index + 1}`} className="w-full h-48 object-cover rounded-lg mb-4" />
                <h3 className="text-2xl font-semibold">Sentiment Insights</h3>
                <p className="text-sm mt-2">Latest findings from our ongoing analysis of TUPT member feedback.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-8 px-4">
        <div className="container mx-auto text-center">
          <p>© 2024 Technological University of the Philippines – Taguig. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
