import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EventUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newImages, setNewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/v1/events/${id}`);
        const { dateStart, dateEnd, images } = response.data.event;
        setEvent({
          ...response.data.event,
          dateStart: dateStart.split('T')[0],
          timeStart: dateStart.split('T')[1].substring(0, 5),
          dateEnd: dateEnd.split('T')[0],
          timeEnd: dateEnd.split('T')[1].substring(0, 5),
        });
        setExistingImages(images);
        setLoading(false);
      } catch (err) {
        setError('Error fetching event details');
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append('name', event.name);
      formData.append('dateStart', `${event.dateStart}T${event.timeStart}`);
      formData.append('dateEnd', `${event.dateEnd}T${event.timeEnd}`);
      formData.append('location', event.location);
      formData.append('description', event.description);
      formData.append('organization', event.organization);

      // Add new images
      newImages.forEach((image) => {
        formData.append('images', image);
      });

      // Add existing images (if any)
      formData.append(
        'existingImages',
        JSON.stringify(existingImages.map((img) => img.publicId))
      );

      await axios.put(`http://localhost:4000/api/v1/events/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('Event updated successfully!');
      navigate('/eventSlist');
    } catch (err) {
      alert('Error updating event');
      console.error(err);
    }
  };

  const handleFileChange = (e) => {
    setNewImages([...newImages, ...e.target.files]);
  };

  const handleRemoveExistingImage = (publicId) => {
    setExistingImages(existingImages.filter((img) => img.publicId !== publicId));
  };

  const handleChange = (field, value) => {
    setEvent((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 dark:bg-gray-900 py-10">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 w-3/4">
        <h2 className="text-2xl font-semibold dark:text-white mb-4">Update Event</h2>
        <form>
          {/* Event Name */}
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">Event Name</label>
            <input
              type="text"
              value={event.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Start Date and Time */}
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">Start Date</label>
            <input
              type="date"
              value={event.dateStart}
              onChange={(e) => handleChange('dateStart', e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">Start Time</label>
            <input
              type="time"
              value={event.timeStart}
              onChange={(e) => handleChange('timeStart', e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* End Date and Time */}
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">End Date</label>
            <input
              type="date"
              value={event.dateEnd}
              onChange={(e) => handleChange('dateEnd', e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">End Time</label>
            <input
              type="time"
              value={event.timeEnd}
              onChange={(e) => handleChange('timeEnd', e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Location */}
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">Location</label>
            <input
              type="text"
              value={event.location}
              onChange={(e) => handleChange('location', e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">Description</label>
            <textarea
              value={event.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            ></textarea>
          </div>

          {/* Organization */}
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">Organization</label>
            <input
              type="text"
              value={event.organization}
              onChange={(e) => handleChange('organization', e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Existing Images */}
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">Existing Images</label>
            <div className="flex flex-wrap gap-4">
              {existingImages.map((img) => (
                <div key={img.publicId} className="relative">
                  <img src={img.url} alt="Event" className="w-32 h-32 object-cover rounded" />
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(img.publicId)}
                    className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Upload New Images */}
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300">Upload New Images</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <button
            type="button"
            onClick={handleUpdate}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 dark:hover:bg-blue-700"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default EventUpdate;
