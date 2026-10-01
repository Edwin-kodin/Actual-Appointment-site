import React from 'react';
import { Link } from 'react-router-dom';
import { Scissors, Search, User, Menu } from 'lucide-react';
import './Navbar.css';

function Navbar() {
  return (
    <header className="navbar glass">
      <div className="container flex-between navbar-inner">
        <Link to="/" className="brand flex-center">
          <div className="logo-icon flex-center">
            <Scissors size={20} />
          </div>
          <span className="brand-text text-gradient-primary">GlowBook</span>
        </Link>
        
        <div className="nav-actions flex-center">
          <Link to="/" className="search-trigger flex-center" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Search size={18} />
            <span>Search</span>
          </Link>
          
          <Link to="/login" className="btn btn-secondary nav-login" style={{ textDecoration: 'none' }}>
            <User size={16} />
            <span>Sign In</span>
          </Link>
          
          <Link to="/login" className="btn btn-primary nav-signup" style={{ textDecoration: 'none' }}>
            For Professionals
          </Link>
          
          <button className="mobile-menu-btn">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
