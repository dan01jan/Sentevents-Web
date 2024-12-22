import React, { useState, useEffect } from "react";
import axios from "axios"; // Make sure to import axios for API requests

const EventModal = ({ eventId, onClose }) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [userId, setUserId] = useState(null);
  const [event, setEvent] = useState(null); // Store event details
  const [loading, setLoading] = useState(true); // Loading state for event data
  const [error, setError] = useState(null); // Error state

  // Fetch userId from localStorage when the component mounts
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      console.error("User ID not found in localStorage");
      alert("User not logged in.");
    }

    const fetchEventDetails = async () => {
      if (!eventId) {
        setError("Event ID is missing");
        return;
      }
      try {
        const response = await axios.get(`http://localhost:4000/api/v1/events/${eventId}`);
        setEvent(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching event details:", err);
        setError("Failed to load event details.");
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId]);

  const handleRatingChange = (value) => {
    setRating(value);
  };

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleSubmit = async () => {
    if (!userId) {
      alert("User ID is missing");
      return;
    }

    try {
      const response = await axios.post("http://localhost:4000/api/v1/ratings/", {
        eventId,
        userId,
        score: rating,
        feedback,
      });
      console.log("Rating submitted successfully:", response.data);
      onClose(); // Close the modal after submission
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert("There was an error submitting your rating.");
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <p>Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Event Feedback</h2>
        <h3>{event?.name}</h3> {/* Display the event name */}
        
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

        {/* Feedback Box */}
        <textarea
          className="w-full p-2 border border-gray-300 rounded-md mb-4"
          rows="4"
          placeholder="Leave your feedback here..."
          value={feedback}
          onChange={handleFeedbackChange}
        />

        <div className="flex justify-end">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2"
            onClick={handleSubmit}
          >
            Submit
          </button>
          <button
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
            onClick={onClose} // Close modal on cancel
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
