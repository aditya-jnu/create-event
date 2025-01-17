import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './components/Home';
import Event from './components/Event';

export default function App() {
  const navigate = useNavigate();

  // useEffect(() => {
  //   // Check if an authorization code is present in the URL
  //   const urlParams = new URLSearchParams(window.location.search);
  //   const code = urlParams.get('code'); // Get the code from the URL

  //   if (code) {
  //     // Send the authorization code to the backend for token exchange
  //     fetch('http://localhost:5000/auth/google/callback', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ code }), // Send the code to backend
  //       credentials: 'include', // Include cookies for session handling
  //     })
  //       .then((response) => response.json())
  //       .then((data) => {
  //         console.log('Tokens received from backend:', data);
  //         alert('Successfully authenticated with Google!');
  //         // Redirect user to event creation page or home
  //         navigate('/create');
  //       })
  //       .catch((error) => {
  //         console.error('Error during token exchange:', error.response?.data || error.message);
  //         alert('Failed to authenticate. Please try again.');
  //       });
  //   }
  // }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create" element={<Event />} />
    </Routes>
  );
}
