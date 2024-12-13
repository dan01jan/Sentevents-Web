import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [course, setCourse] = useState('');
  const [department, setDepartment] = useState('');
  const [organization, setOrganization] = useState('');
  const [other, setOther] = useState('');
  const [coursesData, setCoursesData] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Determine if this is an update or register action
  useEffect(() => {
    if (location.state && location.state.user) {
      setIsUpdateMode(true);
      const user = location.state.user;
      setUserId(user.id);
      setName(user.name);
      setEmail(user.email);
      setCourse(user.course);
      setOther(user.other || '');
    } else {
      setIsUpdateMode(false);
    }
  }, [location]);

  // Fetch courses data on component mount
  useEffect(() => {
    const fetchCoursesData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/v1/course/');
        setCoursesData(response.data);
      } catch (error) {
        console.error('Error fetching courses data:', error);
        setError('Failed to load courses data.');
      }
    };
    fetchCoursesData();
  }, []);

  // Fetch course details
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

  const handleCourseChange = async (e) => {
    const selectedCourseId = e.target.value;
    setCourse(selectedCourseId);

    if (selectedCourseId) {
      await fetchCourseDetails(selectedCourseId);
    } else {
      setDepartment('');
      setOrganization('');
    }
  };

  // Fetch user data if in update mode
  useEffect(() => {
    if (isUpdateMode && userId) {
      const fetchUserData = async () => {
        try {
          const response = await axios.get(`http://localhost:4000/api/v1/users/${userId}`);
          const userData = response.data;

          setName(userData.name);
          setEmail(userData.email);
          setCourse(userData.course._id);
          setDepartment(userData.course.department);
          setOrganization(userData.course.organization);
          setOther(userData.other);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setError('Failed to load user data.');
        }
      };
      fetchUserData();
    }
  }, [isUpdateMode, userId]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = { name, email, course, other };

    try {
        if (isUpdateMode) {
            userData.id = userId;
            const response = await axios.put('/api/v1/users/update-profile', userData);
            alert('Profile updated successfully!');
            navigate('/home');
        } else {
            const response = await axios.post('/api/v1/users/register', userData);
            alert('User registered successfully!');
            navigate('/register');
        }
    } catch (error) {
        console.error('Error updating user:', error);
        setError('Error processing your request.');
    }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-lg w-full max-w-4xl">
        <h2 className="text-2xl font-semibold text-center text-gray-800 dark:text-white mb-4">
          {isUpdateMode ? 'Update Profile' : 'Register'}
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
                disabled={isUpdateMode}
              />
            </div>

            {!isUpdateMode && (
              <div>
                <label htmlFor="password" className="block text-gray-700 dark:text-gray-300">Password</label>
                <input
                  type="password"
                  id="password"
                  className="w-full p-3 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:text-white"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white p-3 rounded-md hover:bg-primary-dark focus:outline-none"
          >
            {isUpdateMode ? 'Update Profile' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
