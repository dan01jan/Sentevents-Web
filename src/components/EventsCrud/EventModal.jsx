import React, { useState, useEffect } from "react";
import axios from "axios";

const EventModal = ({ eventId, onClose }) => {
  const [rating, setRating] = useState({});
  const [feedback, setFeedback] = useState("");
  const [feedbackStars, setFeedbackStars] = useState(0);
  const [userId, setUserId] = useState(null);
  const [event, setEvent] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  const questionsPerPage = 2;

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
      } catch (err) {
        console.error("Error fetching event details:", err);
        setError("Failed to load event details.");
      }
    };

    const fetchQuestions = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/v1/questions/`);
        setQuestions(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching questions:", err);
        setError("Failed to load questions.");
        setLoading(false);
      }
    };

    fetchEventDetails();
    fetchQuestions();
  }, [eventId]);

  const handleRatingChange = (questionId, value) => {
    setRating((prevRatings) => ({
      ...prevRatings,
      [questionId]: value,
    }));
  };

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleFeedbackStars = (stars) => {
    setFeedbackStars(stars);
  };

  const handleSubmit = async () => {
    if (!userId) {
      alert("User ID is missing");
      return;
    }
  
    // Prepare question answers
    const answers = Object.keys(rating).map((questionId) => ({
      questionId,
      answer: rating[questionId],
    }));
  
    try {
      // Submit the question responses
      const questionResponse = await axios.post("http://localhost:4000/api/v1/questionresponses/", {
        eventId,
        userId,
        answers,
      });
      console.log("Answers submitted successfully:", questionResponse.data);
  
      // Submit the feedback (stars + comment)
      const feedbackResponse = await axios.post("http://localhost:4000/api/v1/ratings/", {
        eventId,
        userId,
        score: feedbackStars, // Use the selected star rating (1-5) for the score
        feedback, // Text feedback
        feedbackStars, // Star rating
      });
      console.log("Feedback submitted successfully:", feedbackResponse.data);
  
      onClose(); // Close the modal after submitting
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("There was an error submitting your answers and feedback.");
    }
  };
  
  

  const nextPage = () => {
    if ((currentPage + 1) * questionsPerPage < questions.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
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

  const currentQuestions = questions.slice(currentPage * questionsPerPage, (currentPage + 1) * questionsPerPage);

  const allQuestionsAnswered = Object.keys(rating).length === questions.length;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-blue-600 mb-4">Event Feedback</h2>
        <h3 className="text-lg font-medium mb-4">{event?.name}</h3>

        {!allQuestionsAnswered ? (
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Answer the following questions:</h4>
            {currentQuestions.map((question) => (
              <div key={question._id} className="mb-6">
                <label className="block text-gray-800 font-medium mb-2">{question.question}</label>
                <div className="flex justify-between">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      className={`rounded-full w-10 h-10 flex items-center justify-center transition ${
                        rating[question._id] === value
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-blue-100"
                      }`}
                      onClick={() => handleRatingChange(question._id, value)}
                    >
                      {value}
                    </button>
                  ))}
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center mb-6">
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md transition hover:bg-gray-400"
                onClick={prevPage}
                disabled={currentPage === 0}
              >
                Previous
              </button>
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md transition hover:bg-gray-400"
                onClick={nextPage}
                disabled={(currentPage + 1) * questionsPerPage >= questions.length}
              >
                Next
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex justify-center mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className={`text-3xl ${
                    feedbackStars >= star ? "text-yellow-400" : "text-gray-300"
                  }`}
                  onClick={() => handleFeedbackStars(star)}
                >
                  ★
                </button>
              ))}
            </div>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200 mb-6"
              rows="4"
              placeholder="Leave your feedback here..."
              value={feedback}
              onChange={handleFeedbackChange}
            />
            <div className="flex justify-end">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2 transition hover:bg-blue-600"
                onClick={handleSubmit}
              >
                Submit
              </button>
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md transition hover:bg-gray-400"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventModal;