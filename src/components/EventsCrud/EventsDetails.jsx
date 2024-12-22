import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"; 
import "swiper/css/navigation"; 
import "swiper/css/pagination"; 
import EventModal from './EventModal'; // Ensure correct import of EventModal

const formatTime = (timeStr) => {
  const date = new Date(timeStr);
  let hours = date.getUTCHours();
  let minutes = date.getUTCMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';

  hours = hours % 12 || 12;
  minutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${hours}:${minutes}${ampm}`;
};

const calculateAverageRating = (ratings) => {
  if (ratings.length === 0) return 0;
  const total = ratings.reduce((sum, rating) => sum + rating.score, 0);
  return total / ratings.length;
};

const EventsDetails = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [hasAttended, setHasAttended] = useState(false);
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [isEventEnded, setIsEventEnded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [activeSection, setActiveSection] = useState("Comments");
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");

useEffect(() => {
  const fetchEventDetails = async () => {
    try {
      const eventResponse = await axios.get(`http://localhost:4000/api/v1/events/${id}`);
      setEvent(eventResponse.data.event);

      const registrationResponse = await axios.get(`http://localhost:4000/api/v1/attendance/check-registration`, {
        params: { userId, eventId: id },
      });
      setIsRegistered(!!registrationResponse.data.isRegistered);
      setHasAttended(registrationResponse.data.hasAttended || false);

      const ratingsResponse = await axios.get(`http://localhost:4000/api/v1/ratings/${id}`);
      setRatings(ratingsResponse.data);

      const eventEndTime = new Date(eventResponse.data.event.dateEnd);
      const currentTime = new Date();
      setIsEventEnded(currentTime > eventEndTime);

      setLoading(false);
    } catch (err) {
      console.error("Error fetching event details:", err);
      setError("Failed to load event details.");
      setLoading(false);
    }
  };

  fetchEventDetails();
}, [id, userId]);

useEffect(() => {
  if (ratings.length > 0) {
    const avgRating = calculateAverageRating(ratings);
    setAverageRating(avgRating);
  }
}, [ratings]);


  const handleButtonClick = () => {
    if (isEventEnded) {
      setShowModal(true);
    } else {
      alert("Event has not ended yet.");
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleRegistration = async () => {
    try {
      const response = await axios.post("http://localhost:4000/api/v1/attendance/", {
        userId,
        eventId: id,
      });
      alert("Registration successful!");
      setIsRegistered(true);
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Failed to register. Please try again.");
    }
  };

  if (loading) return <p>Loading event details...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
        <div className="relative bg-gradient-to-r from-indigo-600 to-blue-500 p-8 rounded-md">
          <Swiper spaceBetween={10} slidesPerView={1} loop={true} className="relative z-10">
            {event?.images?.map((image, index) => (
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
          <div className="flex mb-4">
            <span className="text-xl font-semibold text-gray-800">
              Average Rating: {averageRating.toFixed(1)}{" "}
            </span>
            <div className="flex ml-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  xmlns="http://www.w3.org/2000/svg"
                  fill={star <= averageRating ? "yellow" : "gray"}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800">{event.name}</h2>
          <p className="text-gray-600">{event.description}</p>
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800">Event Details</h3>
            <ul className="list-none text-gray-600 space-y-2">
              <li>
                <strong>Date:</strong> {event.dateStart.split("T")[0]} to{" "}
                {event.dateEnd.split("T")[0]}
              </li>
              <li>
                <strong>Time:</strong> {formatTime(event.dateStart)} to{" "}
                {formatTime(event.dateEnd)}
              </li>
              <li>
                <strong>Location:</strong> {event.location}
              </li>
              <li><strong>Brought to you by:</strong> {event.organization}</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="p-8">
        {isRegistered && hasAttended ? (
          <button
            onClick={handleButtonClick}
            className={`bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition duration-300 ${!isEventEnded && 'opacity-50 cursor-not-allowed'}`}
            disabled={!isEventEnded}
          >
            Go to Event Modal
          </button>
        ) : isRegistered ? (
          <button className="bg-gray-400 text-white px-6 py-2 rounded-lg" disabled>
            Already Registered
          </button>
        ) : (
          <button
            onClick={handleRegistration}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition duration-300"
          >
            Register for Event
          </button>
        )}
      </div>

      {showModal && (
        <EventModal
          eventId={id}
          userId={userId}
          userName={userName}
          onClose={closeModal}
        />
      )}

      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="flex space-x-4 mb-6">
          <div onClick={() => setActiveSection("Comments")} className={`cursor-pointer pb-2 ${activeSection === "Comments" ? "text-indigo-600 border-b-4 border-indigo-600" : "text-gray-500"}`}>
            Comments
          </div>
          <div onClick={() => setActiveSection("Ratings")} className={`cursor-pointer pb-2 ${activeSection === "Ratings" ? "text-indigo-600 border-b-4 border-indigo-600" : "text-gray-500"}`}>
            Ratings
          </div>
        </div>

        {activeSection === "Ratings" && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Ratings</h3>
            {ratings.length ? (
              ratings.map((rating, index) => (
                <div key={index} className="border-b pb-4 mb-4">
                  <p className="font-semibold">{rating.userId || "Anonymous"}</p>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className={`w-5 h-5 ${star <= rating.score ? "text-yellow-500" : "text-gray-300"}`}>
                        ★
                      </span>
                    ))}
                  </div>
                  <p>{rating.feedback}</p>
                </div>
              ))
            ) : (
              <p>No ratings yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsDetails;
