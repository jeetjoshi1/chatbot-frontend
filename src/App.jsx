import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './components/Landing';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import PricingPage from './components/PricingPage';
import {Toaster} from 'react-hot-toast'
import SettingsPage from './components/SettingsPage';
import { useState } from 'react';
import { useEffect } from 'react';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  // Assuming you have a way to get user data (e.g., from a custom hook or state)
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Example: Fetching user on mount
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) { setLoading(false); return; }
      
      try {
        const res = await fetch('${import.meta.env.VITE_API_URL}api/user/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) return null; // Or a loading spinner 

  //console.log(user)




  return (
    <>
    <Toaster position="top-center" reverseOrder={false} />
    <Router>
      <Routes>
        {/* Landing Page is the Root */}
        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Landing />} />
        
        {/* Auth Page */}
        <Route path="/auth" element={<Auth />} />

        {/* Protected Dashboard */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="/billing" element={<ProtectedRoute><PricingPage /></ProtectedRoute>} />

        {/* Redirect any 404s to landing */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;