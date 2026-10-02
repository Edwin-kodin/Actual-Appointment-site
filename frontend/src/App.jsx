import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SearchPage from './pages/SearchPage';
import ProviderProfile from './pages/ProviderProfile';
import LoginPage from './pages/LoginPage';
import ClientDashboard from './pages/ClientDashboard';
import ProviderDashboard from './pages/ProviderDashboard';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="page-wrapper">
          <Routes>
            <Route path="/" element={<SearchPage />} />
            <Route path="/provider/:id" element={<ProviderProfile />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/client-dashboard" element={<ClientDashboard />} />
            <Route path="/provider-dashboard" element={<ProviderDashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
