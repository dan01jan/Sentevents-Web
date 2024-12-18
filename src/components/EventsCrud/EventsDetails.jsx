import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"; // Core styles
import "swiper/css/navigation"; // Optional navigation styles
import "swiper/css/pagination"; // Optional pagination styles
import EventModal from './EventModal'; // Import the EventModal component

// Function to format time from ISO string to 12-hour format with AM/PM
const formatTime = (timeStr) => {
  const date = new Date(timeStr); // Convert ISO string to Date object
  
  // Get the hours and minutes from the Date object
  let hours = date.getUTCHours(); // Get UTC hours to prevent local timezone conversion
  let minutes = date.getUTCMinutes(); // Get UTC minutes
  const ampm = hours >= 12 ? 'pm' : 'am';

  // Convert to 12-hour format
  hours = hours % 12;
  hours = hours ? hours : 12; // Convert 0 hours to 12 for 12-hour format
  minutes = minutes < 10 ? '0' + minutes : minutes; // Ensure two-digit minutes

  return `${hours}:${minutes}${ampm}`; // Return formatted time
};

const EventsDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rating, setRating] = useState(0); // Rating state
  const [isEventEnded, setIsEventEnded] = useState(false); // Check if the event has ended
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const userId = 456; // Example user ID, ideally this would come from the user session or authentication context

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/v1/events/${id}`
        );
        setEvent(response.data.event);
        setLoading(false);

        // Check if the event has ended
        const eventEndTime = new Date(response.data.event.dateEnd);
        const currentTime = new Date();
        setIsEventEnded(currentTime > eventEndTime); // Set event ended status
      } catch (err) {
        console.error("Error fetching event details:", err);
        setError("Failed to load event details.");
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  const handleRatingChange = (value) => {
    setRating(value);
  };

  const handleButtonClick = () => {
    if (isEventEnded) {
      setShowModal(true); // Show the modal when the event has ended
    }
  };

  const closeModal = () => {
    setShowModal(false); // Close the modal
  };

  if (loading) {
    return <p>Loading event details...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
        <div className="relative bg-gradient-to-r from-indigo-600 to-blue-500 p-8 rounded-md">
          <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-500 rounded-full opacity-50"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-blue-400 rounded-full opacity-50"></div>

          {/* Swiper Carousel */}
          <Swiper spaceBetween={10} slidesPerView={1} loop={true} className="relative z-10">
            {event.images.map((image, index) => (
              <SwiperSlide key={index}>
                <img
                  src={image.url}
                  alt={`Event Image ${index + 1}`}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div>
          {/* Star Rating */}
          <div className="flex mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                xmlns="http://www.w3.org/2000/svg"
                fill={star <= rating ? "yellow" : "gray"}
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6 cursor-pointer"
                onClick={() => handleRatingChange(star)}
              >
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            ))}
          </div>
          
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {event.name}
          </h2>
          <p className="text-gray-600 mb-4">{event.description}</p>
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800">Event Details</h3>
            <ul className="list-none text-gray-600 space-y-2">
              <li>
                <strong>Date:</strong> {event.dateStart.split('T')[0]} to {event.dateEnd.split('T')[0]}
              </li>
              <li>
                <strong>Time:</strong> {formatTime(event.dateStart)} to {formatTime(event.dateEnd)}
              </li>
              <li>
                <strong>Location:</strong> {event.location}
              </li>
              <li>
                <strong>Brought to you by:</strong> {event.organization}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Button that is only clickable if the event has ended */}
      <div className="p-8">
        <button
          onClick={handleButtonClick}
          disabled={!isEventEnded}
          className={`${
            isEventEnded ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-400 cursor-not-allowed"
          } text-white px-6 py-2 rounded-lg transition duration-300`}
        >
          Go to Event Modal
        </button>
      </div>

      {/* Event Modal */}
      {showModal && (
        <EventModal
          eventId={id}
          userId={userId}
          onClose={closeModal}
        />
      )}
      
      {/* Comment Section */}
      <div className="p-8 bg-gray-100 mt-8 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Leave a Comment
        </h3>
        <form className="space-y-4">
          <textarea
            className="w-full p-4 rounded-lg border border-gray-300"
            rows="4"
            placeholder="Write your comment here..."
          ></textarea>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
            >
              Post Comment
            </button>
          </div>
        </form>

        <div className="mt-6">
          <h4 className="text-lg font-semibold text-gray-800">Recent Comments</h4>
          <div className="space-y-4 mt-4">
            <div className="border-b pb-4">
              <p className="text-gray-600">
                John Doe: Great icon pack! Really useful for UI design.
              </p>
            </div>
            <div className="border-b pb-4">
              <p className="text-gray-600">
                Jane Smith: I love the variety of styles included in this pack.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsDetails;
