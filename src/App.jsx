import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { gapi } from 'gapi-script'; // Import the Google API library
import Navbar from './components/Navbar/Navbar';
import Home from './components/LandingPage/Home';
import CardSection from './components/CardSection/CardSection';
import Login from './components/LandingPage/Login';
import Register from './components/LandingPage/Register';
import Cloud from './components/LandingPage/Cloud';
import Sentiment from './components/Analysis/Sentiment';
import EventList from './components/EventsCrud/EventList';
import UpdateProfile from './components/LandingPage/UpdateProfile';
import EventCreate from './components/EventsCrud/EventCreate';
import EventUpdate from './components/EventsCrud/EventUpdate';


function App() {
  useEffect(() => {
    function start() {
      gapi.client.init({
        clientId: "366316088279-bo10u9olph7u45nnabpvbkhg4bq525mv.apps.googleusercontent.com", // Your client ID
        scope: "email", // Scopes you want to request
      });
    }

    gapi.load("client:auth2", start); // Load the Google API client
  }, []); // Empty dependency array to run only once

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/admin" element={<CardSection />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/updateProfile" element={<UpdateProfile />} />
        <Route path="/cloud" element={<Cloud />} />
        <Route path="/sentiments" element={<Sentiment />} />
        <Route path="/eventslist" element={<EventList />} />
        <Route path="/eventscreate" element={<EventCreate />} />
        <Route path="/eventsupdate/:id" element={<EventUpdate />} />
      </Routes>
    </Router>
  );
}

export default App;
