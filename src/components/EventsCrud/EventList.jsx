import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EventList = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/v1/events');
        setEvents(response.data.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching events');
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleDelete = (id) => {
    // Implement delete functionality
    console.log(`Delete event with id: ${id}`);
  };

  const handleEdit = (id) => {
    // Implement edit functionality
    navigate(`/eventsupdate/${id}`);
    console.log(`Edit event with id: ${id}`);
  };

  const handleCreate = () => navigate('/eventscreate');

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 dark:bg-gray-900 py-10">
      <div className="overflow-x-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg mt-4 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold dark:text-white">Event Data Table</h2>
          <button
            onClick={handleCreate}
            className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 dark:hover:bg-green-700"
          >
            Create
          </button>
        </div>
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-green-500 text-white dark:bg-green-700">
              <th className="py-2 px-4 text-left">Event Name</th>
              <th className="py-2 px-4 text-left">Start Date</th>
              <th className="py-2 px-4 text-left">End Date</th>
              <th className="py-2 px-4 text-left">Location</th>
              <th className="py-2 px-4 text-left">Description</th>
              <th className="py-2 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event._id} className="border-b hover:bg-gray-100 dark:hover:bg-gray-700">
                <td className="py-2 px-4 dark:text-gray-300">{event.name}</td>
                <td className="py-2 px-4 dark:text-gray-300">{new Date(event.dateStart).toLocaleDateString()}</td>
                <td className="py-2 px-4 dark:text-gray-300">{new Date(event.dateEnd).toLocaleDateString()}</td>
                <td className="py-2 px-4 dark:text-gray-300">{event.location}</td>
                <td className="py-2 px-4 dark:text-gray-300">{event.description}</td>
                <td className="py-2 px-4 text-center">
                  <button
                    onClick={() => handleEdit(event._id)}
                    className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(event._id)}
                    className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 dark:hover:bg-red-700"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventList;
