import React, { useState, useEffect } from "react";
import axios from "axios";

const Attendance = () => {
  const [eventId, setEventId] = useState(""); // Event ID
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [events, setEvents] = useState([]); // Store events list
  const [attendees, setAttendees] = useState([]);
  const [selectedAttendees, setSelectedAttendees] = useState([]); // Track selected attendees

  // Fetch all events when the component mounts
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:4000/api/v1/events/");
        setEvents(response.data.data); // Correctly access the events from response.data.data
      } catch (err) {
        setError("Error fetching events");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Fetch attendees for the selected event
  const fetchAttendees = async () => {
    if (!eventId) {
      setError("Event ID is required");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await axios.get(`http://localhost:4000/api/v1/attendance/getUsersByEvent/${eventId}`);
      setAttendees(response.data);
    } catch (err) {
      setError("Error fetching attendees");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle checkbox change
  const handleCheckboxChange = (userId) => {
    setSelectedAttendees((prevSelected) => {
      if (prevSelected.includes(userId)) {
        // If already selected, unselect it
        return prevSelected.filter((id) => id !== userId);
      } else {
        // Otherwise, add it to the selected list
        return [...prevSelected, userId];
      }
    });
  };

  // Approve attendance for selected attendees
  const approveAttendance = async () => {
    if (!eventId) {
      setError("Event ID is required to approve attendance.");
      return;
    }

    if (selectedAttendees.length === 0) {
      setError("No attendees selected for approval.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const attendeesToUpdate = attendees
        .filter((attendee) => selectedAttendees.includes(attendee.userId))
        .map((attendee) => ({
          userId: attendee.userId,
          hasAttended: true, // Mark as attended
        }));

      await axios.put(`http://localhost:4000/api/v1/attendance/updateUsersAttendance/${eventId}`, {
        attendees: attendeesToUpdate,
      });

      alert("Attendance approved successfully!");
    } catch (err) {
      setError("Error approving attendance");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-4xl w-full">
        <h1 className="text-2xl font-semibold mb-4 text-gray-800">Attendance Approval</h1>

        {/* Event Selection */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Select Event</label>
            <select
              value={eventId}
              onChange={(e) => setEventId(e.target.value)}
              className="w-full mt-1 p-2 border rounded-md focus:ring focus:ring-indigo-200"
            >
              <option value="">Select an event</option>
              {events.length > 0 ? (
                events.map((event) => (
                  <option key={event._id} value={event._id}>
                    {event.name}
                  </option>
                ))
              ) : (
                <option disabled>No events available</option>
              )}
            </select>
          </div>
        </div>

        {/* Fetch Attendees Button */}
        {events.length > 0 && (
          <button
            onClick={fetchAttendees}
            disabled={loading}
            className="w-full mt-4 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Loading..." : "Fetch Attendees"}
          </button>
        )}

        {/* Display Error or Attendees */}
        {error && <p className="mt-4 text-red-600">{error}</p>}
        {attendees.length > 0 && (
          <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <h2 className="text-lg font-semibold">Event Attendees:</h2>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {/* Unapproved Attendees Column */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700">Unapproved Attendees</h3>
              <ul>
                {attendees
                  .filter((attendee) => !attendee.hasAttended) // Filter attendees who haven't been approved
                  .map((attendee) => (
                    <li key={attendee.userId} className="text-sm flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedAttendees.includes(attendee.userId)}
                        onChange={() => handleCheckboxChange(attendee.userId)}
                        className="mr-2"
                      />
                      {attendee.firstName} {attendee.lastName}
                    </li>
                  ))}
              </ul>
            </div>
        
            {/* Approved Attendees Column */}
            <div>
              <h3 className="text-sm font-semibold text-gray-700">Approved Attendees</h3>
              <ul>
                {attendees
                  .filter((attendee) => attendee.hasAttended) // Filter attendees who have been approved
                  .map((attendee) => (
                    <li key={attendee.userId} className="text-sm">
                      {attendee.firstName} {attendee.lastName}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
        
        )}

        {/* Approve Attendance Button */}
        {attendees.length > 0 && selectedAttendees.length > 0 && (
          <button
            onClick={approveAttendance}
            className="w-full mt-4 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
          >
            Approve Attendance
          </button>
        )}

        {/* Fallback if no events are fetched */}
        {events.length === 0 && !loading && !error && (
          <p className="text-sm text-gray-600 mt-4">No events to display</p>
        )}
      </div>
    </div>
  );
};

export default Attendance;
