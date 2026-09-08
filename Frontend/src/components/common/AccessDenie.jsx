import React from 'react'
import './style/accessDenied.css'
import { Link } from "react-router-dom";
import { FaLock } from "react-icons/fa";


export  function AccessDenie() {
  return (
    <div className="denied-container">

      <div className="denied-card">

        <FaLock className="lock-icon" />

        <h1>403</h1>

        <h2>Access Denied</h2>

        <p>
          Sorry! You don't have permission to access this page.
          Please login to continue.
        </p>

        <div className="btn-group">
          <Link to="/">
            <button className="home-btn">
              Go to Home
            </button>
          </Link>

          <Link to="/login">
            <button className="login-btn">
              Login
            </button>
          </Link>
        </div>

      </div>

    </div>
  );
}
