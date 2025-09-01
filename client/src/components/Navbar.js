import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          🎯 Tambola Host Dashboard
        </Link>
        <ul className="nav-links">
          <li>
            <Link to="/" className={isActive('/') ? 'active' : ''}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/upload" className={isActive('/upload') ? 'active' : ''}>
              Upload Tickets
            </Link>
          </li>
          <li>
            <Link to="/game" className={isActive('/game') ? 'active' : ''}>
              Game Control
            </Link>
          </li>
          <li>
            <Link to="/verify" className={isActive('/verify') ? 'active' : ''}>
              Verify Claims
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
