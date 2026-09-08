import React, { useState } from "react";
import { Link} from "react-router-dom";
import "./styles/navbar.css";
import { MdHome } from "react-icons/md";
import { MdPerson2 } from "react-icons/md";
import { useSelector } from "react-redux";
import { BsChatDotsFill } from "react-icons/bs";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { token } = useSelector((state) => state.authSlice);

  function handleOpen(e) {
    setOpen(false);
  }


  return (
    <nav className="nav-div">

      <div className="nav-logo">
        {token ? (
          <div className="nav-profile-logo">
            <div><BsChatDotsFill size={24} /></div>
            Friends Chat
          </div>
        ) : (
          <Link to="/">
            <div className="nav-profile-logo">
              <div><BsChatDotsFill size={24} /></div>
              Friends Chat
            </div>
          </Link>
        )}
      </div>

      <div className="menu-icon" onClick={() => setOpen(!open)}>
        ☰
      </div>

      <div className={`nav-links ${open ? "active" : ""}`}>


        <ul className="nav-center">

          <li onClick={handleOpen} className={token ? "profile-active" : "nav-link"}>
            {token ? (
              <Link to="/profile"><MdPerson2 /> Profile</Link>
            ) : (
              <Link to="/"><MdHome /> Home</Link>
            )}
          </li>

          <li onClick={handleOpen} className={!token ? "nav-link" : "logout-link"}>
            <Link to="/contact">Contact</Link>
          </li>


          <li onClick={handleOpen} className={!token ? "nav-link" : "logout-link"}>
            <Link to="/about">About</Link>
          </li>

        </ul>

    
        {!token && (
          <ul className="nav-right">

            <li className="login nav-link" onClick={handleOpen}>
              <Link to="/login">Login</Link>
            </li>

            <li className="link-4 nav-link" onClick={handleOpen}>
              <Link to="/register">Register</Link>
            </li>

          </ul>
        )}

      </div>

    </nav>
  );
};

export default Navbar;
