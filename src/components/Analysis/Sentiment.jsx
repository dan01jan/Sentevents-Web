import React, { useState } from "react";
import axios from "axios";

const Sentiment = () => {
  const [message, setMessage] = useState(""); // State to hold the user message
  const [result, setResult] = useState(null); // State to hold the sentiment result
  const [error, setError] = useState(null); // State to handle errors

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form from refreshing the page

    try {
      // Clear previous results
      setResult(null);
      setError(null);

      // Call the sentiment analysis API
      const response = await axios.post("http://localhost:4000/api/v1/sentiments/analyze", { message });

      // Extract prediction and probability from the response
      const sentiment = response.data.sentimentResult[0]; // Assuming the sentiment result is in the first item of the array
      const prediction = sentiment.predictions[0].prediction;
      const probability = sentiment.predictions[0].probability;

      // Update the result state with the extracted prediction and probability
      setResult({ prediction, probability });
    } catch (err) {
      console.error("Error analyzing sentiment:", err);
      setError("Failed to analyze sentiment. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg flex flex-col md:flex-row gap-6 max-w-4xl">
        {/* Right Side - Form */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Sentiments Trial</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <textarea
              placeholder="Message"
              rows="4"
              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 outline-none dark:bg-gray-700 dark:text-white"
              value={message} // Bind textarea value to state
              onChange={(e) => setMessage(e.target.value)} // Update state on input
            ></textarea>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 transition"
            >
              Feedback Sentiment
            </button>
          </form>

          {/* Display Sentiment Result */}
          {result && (
            <div className="mt-4 p-4 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-700">
              <h4 className="text-lg font-semibold dark:text-white">Sentiment Analysis Result:</h4>
              <p className="text-gray-700 dark:text-gray-300 mt-2">
                <strong>Prediction:</strong> {result.prediction}
              </p>
              <p className="text-gray-700 dark:text-gray-300 mt-2">
                <strong>Probability:</strong> {result.probability}
              </p>
            </div>
          )}

          {/* Display Error Message */}
          {error && (
            <div className="mt-4 p-4 border border-red-300 rounded-md bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sentiment;
