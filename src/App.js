// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Charge from './components/Charge';
import Success from './Success';
import Fail from "./Fail";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setUser('사용자');
    }
  }, []);

  const handleLogin = (email) => {
    setUser(email.split('@')[0] || email);
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
  };

  return (
      <Router>
        <Routes>
          <Route
              path="/"
              element={
                user ? (
                    <Charge user={user} onLogout={handleLogout} />
                ) : (
                    <Login onLogin={handleLogin} />
                )
              }
          />
          <Route path="/payments/success" element={<Success />} />
          <Route path="/payments/fail" element={<Fail />} />
        </Routes>
      </Router>
  );
}

export default App;