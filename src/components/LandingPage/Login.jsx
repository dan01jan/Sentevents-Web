import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';
import axios from 'axios';

const Login = () => {
    const navigate = useNavigate();

    const handleGoogleLogin = async (googleData) => {
      try {
          // Send the token ID to your backend to verify
          const response = await axios.post('http://localhost:4000/api/v1/users/google_login', {
              tokenId: googleData.tokenId,
          });
  
          // Log the response to see the structure of the data
          console.log('Google login response:', response.data);
  
          // Check if the necessary user data exists in the response
          if (response.data && response.data.user) {
              const { user, token } = response.data;
  
              // Store user's data in localStorage
              localStorage.setItem('authToken', token);  // Store the token
              localStorage.setItem('userName', user.name);  // Store the user's name
              localStorage.setItem('userEmail', user.email);  // Store the user's email
              localStorage.setItem('userId', user._id);  // Store the user's ID
  
              // Dispatch event for login success
              window.dispatchEvent(new Event('loginSuccess'));
  
              // Navigate based on profile completion status
              if (response.data.isProfileComplete) {
                  navigate('/home');
              } else {
                  navigate('/updateProfile', { state: { user } });
              }
          } else {
              console.error('Invalid response data:', response.data);
              alert('Failed to retrieve user data.');
          }
      } catch (error) {
          console.error('Error with Google login:', error);
          alert('Google login failed');
      }
  };
  
  

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-sm">
                <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>
                
                {/* Google Login Button */}
                <div className="mt-4">
                    <GoogleLogin
                        clientId="366316088279-bo10u9olph7u45nnabpvbkhg4bq525mv.apps.googleusercontent.com"
                        buttonText="Login with Google"
                        onSuccess={handleGoogleLogin}  // Use the integrated handleGoogleLogin function
                        onFailure={(error) => console.error('Google Login Failed:', error)}
                        cookiePolicy={'single_host_origin'}
                        className="w-full mt-2"
                    />
                </div>

                {/* Link to Register */}
                <p className="mt-4 text-center">
                    Don't have an account? <Link to="/register" className="text-blue-500">Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
