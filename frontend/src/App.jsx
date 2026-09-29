import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SearchPage from './pages/SearchPage';
import ProviderProfile from './pages/ProviderProfile';
import LoginPage from './pages/LoginPage';

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
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
