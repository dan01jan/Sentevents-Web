import React from 'react';
import weblogo from '../../assets/website/weblogo.png';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; 

const Home = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/v1/events');
        setEvents(response.data.data); // Set all events
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const handleEventClick = (eventId) => {
    navigate(`/eventsdetails/${eventId}`);
  };

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
            </div>
          </div>
        </div>
      </section>

      {/* Latest Events Section */}
      <section className="py-16 px-8 bg-gray-200 dark:bg-gray-800">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold mb-8">Recent Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {events.slice(0, 3).map((event) => ( // Display only the first 3 events
              <EventCard 
                key={event._id} 
                event={event} 
                onClick={() => handleEventClick(event._id)} 
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* All Events Section */}
      <section className="py-16 px-8 bg-gray-200 dark:bg-gray-800">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold mb-8">All Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {events.map((event) => ( // Display all events
              <EventCard 
                key={event._id} 
                event={event} 
                onClick={() => handleEventClick(event._id)} 
              />
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

const EventCard = ({ event, onClick }) => {
  const imageUrl = event.images?.[0]?.url || event.images?.[0] || "https://via.placeholder.com/150";
  
  // Static rating value (use event.rating if available)
  const staticRating = event.rating || 3; // Example: default to 3 stars if no rating available

  return (
    <div 
      className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-md cursor-pointer"
      onClick={onClick}
    >
      <img 
        src={imageUrl}
        alt={event.name}
        className="w-full h-48 object-cover rounded-lg mb-4"
        onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
      />
      <h3 className="text-2xl font-semibold">{event.name}</h3>
      <p className="mt-2">{event.description}</p>

      {/* Static Star Rating under Description */}
      <div className="mt-4 flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            xmlns="http://www.w3.org/2000/svg"
            fill={star <= staticRating ? "yellow" : "gray"}
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
        ))}
      </div>
    </div>
  );
};

export default Home;