import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const EventCreate = () => {
  const [eventData, setEventData] = useState({
    name: '',
    dateStart: '',
    timeStart: '',
    dateEnd: '',
    timeEnd: '',
    location: '',
    description: '',
    images: [],
    userName: '',
    organization: ''
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const storedOrganization = localStorage.getItem('organization');

    if (storedUser) {
      setEventData(prevData => ({
        ...prevData,
        userName: storedUser.name || '',
      }));
    }

    if (storedOrganization) {
      setEventData(prevData => ({
        ...prevData,
        organization: storedOrganization,
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({
      ...eventData,
      [name]: value,
    });
    setErrors({ ...errors, [name]: '' }); // Clear errors for the field being updated
  };

  const handleImageChange = (e) => {
    const files = e.target.files;
    setEventData({
      ...eventData,
      images: files,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ['name', 'dateStart', 'timeStart', 'dateEnd', 'timeEnd', 'location', 'description'];

    requiredFields.forEach(field => {
      if (!eventData[field]) {
        newErrors[field] = 'This field is required';
      }
    });

    if (eventData.dateStart && eventData.dateEnd) {
      const startDate = new Date(`${eventData.dateStart}T${eventData.timeStart}`);
      const endDate = new Date(`${eventData.dateEnd}T${eventData.timeEnd}`);

      if (startDate > endDate) {
        newErrors.dateEnd = 'End date and time must be after the start date and time';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formData = new FormData();
    Object.entries(eventData).forEach(([key, value]) => {
      if (key === 'images') {
        for (let i = 0; i < value.length; i++) {
          formData.append('images', value[i]);
        }
      } else {
        formData.append(key, value);
      }
    });

    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('User not authenticated. Please log in.');
      return;
    }
    formData.append('userId', userId);

    try {
      const response = await axios.post('http://localhost:4000/api/v1/events/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log('Event created:', response.data);
      navigate('/eventslist');
    } catch (error) {
      console.error('Error creating event:', error.response?.data || error.message);
      alert('An error occurred while creating the event. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 py-10">
      <div className="max-w-xl mx-auto my-10 p-6 bg-white dark:bg-gray-800 shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold text-center mb-6 dark:text-white">Create Event</h2>
        <form onSubmit={handleSubmit}>
          {['name', 'location', 'description'].map(field => (
            <div className="mb-4" key={field}>
              <label
                htmlFor={field}
                className="block text-gray-700 font-medium mb-2 dark:text-gray-300"
              >
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type={field === 'description' ? 'textarea' : 'text'}
                id={field}
                name={field}
                value={eventData[field]}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-700 dark:text-white"
                required
              />
              {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
            </div>
          ))}

          {['dateStart', 'dateEnd'].map(field => (
            <div className="mb-4" key={field}>
              <label
                htmlFor={field}
                className="block text-gray-700 font-medium mb-2 dark:text-gray-300"
              >
                {field === 'dateStart' ? 'Event Start Date' : 'Event End Date'}
              </label>
              <input
                type="date"
                id={field}
                name={field}
                value={eventData[field]}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-700 dark:text-white"
                required
              />
              {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
            </div>
          ))}

          {['timeStart', 'timeEnd'].map(field => (
            <div className="mb-4" key={field}>
              <label
                htmlFor={field}
                className="block text-gray-700 font-medium mb-2 dark:text-gray-300"
              >
                {field === 'timeStart' ? 'Event Start Time' : 'Event End Time'}
              </label>
              <input
                type="time"
                id={field}
                name={field}
                value={eventData[field]}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-700 dark:text-white"
                required
              />
              {errors[field] && <p className="text-red-500 text-sm">{errors[field]}</p>}
            </div>
          ))}

          <div className="mb-4">
            <label
              htmlFor="images"
              className="block text-gray-700 font-medium mb-2 dark:text-gray-300"
            >
              Event Images
            </label>
            <input
              type="file"
              id="images"
              name="images"
              multiple
              onChange={handleImageChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md dark:bg-gray-700 dark:text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 dark:hover:bg-green-700"
          >
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
};

export default EventCreate;