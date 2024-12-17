import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const UpdateProfile = () => {
  const [user, setUser] = useState(null); // State to store user data
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [course, setCourse] = useState('');
  const [department, setDepartment] = useState('');
  const [organization, setOrganization] = useState('');
  const [other, setOther] = useState('');
  const [password, setPassword] = useState('');
  const [coursesData, setCoursesData] = useState([]);
  const [error, setError] = useState(null);
  const location = useLocation(); // Access location state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem('userId'); // Retrieve userId from localStorage
      if (!userId) {
        console.error('No user ID found in localStorage');
        return;
      }

      try {
        // Fetch user details from /google_details endpoint
        const response = await axios.get('http://localhost:4000/api/v1/google_details', {
          headers: { 'User-Id': userId },
        });
        setUser(response.data); // Update state with fetched user data

        // Pre-fill the form fields with user data
        setName(response.data.name);
        setEmail(response.data.email);
        setCourse(response.data.course ? response.data.course._id : '');
        setDepartment(response.data.course ? response.data.course.department.name : '');
        setOrganization(response.data.course ? response.data.course.organization.name : '');
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (location.state && location.state.user) {
      setUser(location.state.user);
      console.log('User data from state:', location.state.user);
      setName(location.state.user.name);
      setEmail(location.state.user.email);
      setCourse(location.state.user.course ? location.state.user.course._id : '');
      setDepartment(location.state.user.course ? location.state.user.course.department.name : '');
      setOrganization(location.state.user.course ? location.state.user.course.organization.name : '');
    } else {
      fetchUserData(); // Fallback to fetching data from backend
    }

    // Fetch available courses data for dropdown
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/v1/course');
        setCoursesData(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses(); // Load courses data
  }, [location.state]);

  // Fetch course details (department and organization)
  const fetchCourseDetails = async (courseId) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/v1/course/${courseId}`);
      const courseData = response.data;
      setDepartment(courseData.department || '');
      setOrganization(courseData.organization || '');
    } catch (error) {
      console.error('Error fetching course details:', error);
      setError('Failed to load course details.');
    }
  };

  const handleCourseChange = (e) => {
    const selectedCourseId = e.target.value;
    setCourse(selectedCourseId);

    if (selectedCourseId) {
      fetchCourseDetails(selectedCourseId); // Fetch details when course changes
    } else {
      setDepartment('');
      setOrganization('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const token = localStorage.getItem('authToken'); // Get the token from localStorage (or sessionStorage)
    if (!token) {
      setError('Authorization token is missing. Please log in again.');
      return;
    }
  
    try {
      const updateData = {
        name,
        email,
        course,
        organization,
        other,
        password,
      };
  
      const response = await axios.put(
        `http://localhost:4000/api/v1/users/${user._id}`,
        updateData,
        {
          headers: {
            'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );
      alert('Profile updated successfully');
      setUser(response.data); // Update the user state with the latest data

      // Redirect to /home after successful profile update
      navigate('/home');
    } catch (error) {
      setError('Failed to update profile. Please try again.');
      console.error('Error updating profile:', error);
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-lg w-full max-w-4xl">
        <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white mb-4">
          Profile
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="name" className="block text-gray-700 dark:text-gray-300">Name</label>
              <input
                type="text"
                id="name"
                className="w-full p-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="course" className="block text-gray-700 dark:text-gray-300">Course</label>
              <select
                id="course"
                className="w-full p-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                value={course}
                onChange={handleCourseChange}
                required
              >
                <option value="">Select Course</option>
                {coursesData.map(course => (
                  <option key={course._id} value={course._id}>{course.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label htmlFor="department" className="block text-gray-700 dark:text-gray-300">Department</label>
              <input
                type="text"
                id="department"
                className="w-full p-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                value={department}
                disabled
              />
            </div>

            <div>
              <label htmlFor="organization" className="block text-gray-700 dark:text-gray-300">Organization</label>
              <input
                type="text"
                id="organization"
                className="w-full p-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                value={organization}
                disabled
              />
            </div>

            <div>
              <label htmlFor="other" className="block text-gray-700 dark:text-gray-300">Other (Optional)</label>
              <select
                id="other"
                className="w-full p-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                value={other}
                onChange={(e) => setOther(e.target.value)}
              >
                <option value="">Select Option</option>
                <option value="Lord Ikaw na bahala">Lord Ikaw na bahala</option>
                <option value="Makakapasa this Sem">Makakapasa this Sem</option>
                <option value="Keri pa bes">Keri pa bes</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="email" className="block text-gray-700 dark:text-gray-300">Email</label>
              <input
                type="email"
                id="email"
                className="w-full p-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white p-3 rounded-md hover:bg-primary-dark focus:outline-none"
          >
            Confirm
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
