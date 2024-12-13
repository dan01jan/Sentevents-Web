import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DarkMode from './DarkMode';
import axios from 'axios';

const MenuLinks = [
  { id: 1, name: "Home", link: "/home" },
  { id: 2, name: "Cloud Words", link: "/cloud" },
  { id: 3, name: "Blogs", link: "/blogs" },
  { id: 4, name: "Sentiment", link: "/sentiments" },
  { id: 5, name: "Events", link: "/eventslist" },
];

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState(localStorage.getItem('userName'));
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    const token = localStorage.getItem('authToken');
  
    if (storedUserName) {
      setUserName(storedUserName);
      setIsLoggedIn(true);
    } else if (token) {
      const fetchUserData = async () => {
        try {
          const googleDetailsResponse = await axios.get('http://localhost:4000/api/v1/google_details', {
            headers: { Authorization: `Bearer ${token}` },
          });
  
          if (googleDetailsResponse.status === 200) {
            const { name } = googleDetailsResponse.data;
            setUserName(name);
            setIsLoggedIn(true);
  
            localStorage.setItem('userName', name);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setIsLoggedIn(false);
        }
      };
  
      fetchUserData();
    } else {
      setIsLoggedIn(false);
    }
  }, []);
  
  const handleLogin = (userName, authToken) => {
    localStorage.setItem('userName', userName);
    localStorage.setItem('authToken', authToken);

    setUserName(userName);
    setIsLoggedIn(true);

    navigate('/home');  // Redirect after login
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    setIsLoggedIn(false);
    setUserName(null);
    navigate('/login');  // Redirect to login page
  };

  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white duration-200 relative z-40">
      <div className="py-4">
        <div className="container flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="text-primary font-semibold tracking-widest text-2xl uppercase sm:text-3xl">VOYS</Link>
            <div className="hidden lg:block">
              <ul className="flex items-center gap-4">
                {MenuLinks.map((data) => (
                  <li key={data.id}>
                    <Link
                      to={data.link}
                      className="inline-block px-4 font-semibold text-gray-500 hover:text-black dark:hover:text-white duration-200"
                    >
                      {data.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <span className="text-gray-600 dark:text-gray-200 truncate max-w-[150px]">{userName}</span>
                <button
                  onClick={handleLogout}
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark focus:outline-none duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <span className="text-gray-600 dark:text-gray-200 truncate max-w-[150px]">FUCK LIFE</span>
                <Link 
                  to="/login" 
                  className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark focus:outline-none duration-200"
                >
                  Login
                </Link>
              </>
            )}
            <DarkMode />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
