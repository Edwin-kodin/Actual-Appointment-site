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
          <div className="search-trigger flex-center">
            <Search size={18} />
            <span>Search</span>
          </div>
          
          <button className="btn btn-secondary nav-login">
            <User size={16} />
            <span>Sign In</span>
          </button>
          
          <button className="btn btn-primary nav-signup">
            For Professionals
          </button>
          
          <button className="mobile-menu-btn">
            <Menu size={24} />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
