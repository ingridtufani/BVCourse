import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container nav-content">
        <Link to="/" className="nav-logo">
          <span>🎓</span>
          Bow Registration
        </Link>
        
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/signup" className="nav-link">Signup</Link>
          <Link to="/login" className="nav-link">Login</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;