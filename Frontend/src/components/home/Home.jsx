import React from 'react'
import './styles/home.css'
import Navbar from './Navbar';
import HomeImg from "../../assets/home.png"
import { useNavigate } from 'react-router-dom';
import { MdPerson2,MdSecurity } from "react-icons/md";
import { IoArrowForward } from "react-icons/io5";
import { BsChatDotsFill } from "react-icons/bs";
import { FaUserFriends,FaGithub, FaInstagram, FaFacebook, FaLinkedin } from "react-icons/fa";



const Home = () => {

  const navigate = useNavigate()

  return (
    // <div>
      <div className='home-div'>

        <div className='main-home'>

          <div className='box1-home'>
            <p className='tag-line'>Connect. Chat. Stay Togethar.</p>
            <h1>Welcome to</h1>
            <h1 id='h1-c'>Friends Chart!</h1>

            <div className='box1-home-div'>
              <p>Every friendship has a story. <br></br>
                We turn it into charts
                you’ll love.</p>

              <div className='home-button-div'>
                <button className='btn-1' onClick={() => navigate("/register")}>Get Started
                  <span><IoArrowForward /></span>
                </button>

                <button className='btn-2' onClick={() => navigate("/login")}><MdPerson2 />Login</button>
              </div>

            </div>
          </div>

          <div className='box2-home'>
            <img src={HomeImg} alt='Not Found'
            loading='eager'
            fetchPriority='high'
            />
          </div>

        </div>

        <div className='home-sub-container' >

        <div className='sub-box1-container'>
          <h2>Why Choose <span>Friends Chat</span> ?</h2>
        </div>

        <div className='sub-box2-container'>

          <div className='box-1'>

              <div className='msg-icon'>
                <BsChatDotsFill size={28}/>
              </div>

              <div className='content'>
                <h3>Real Time Messaging</h3>
                <p>Instantly send and receive
                   messages in real-time with
                   your friends.</p>
              </div>

          </div>

          <div className='box-2'>

            <div className='friends-icon'>
              <FaUserFriends size={28}/>
            </div>

              <div className='content'>
                <h3>Friend Management</h3>
                <p>Search users, send friend
                   request and build your
                   connections.</p>
              </div>
          </div>

          <div className='box-3'>

            <div className='security-icon'>
              <MdSecurity size={28}/>
            </div>

              <div className='content'>
                <h3>Secure & Private</h3>
                <p>Your conversations are safe 
                   with us. we value your
                   privacy</p>
              </div>
          </div>

        </div>

      </div>

      
      <footer className='footer'>

        <div className="card-1 card">
          <h3><span><BsChatDotsFill size={28}/></span> Friends Chat</h3>
          <p>Stay connected. Stay close.</p>
          <p>Made with love for real connections.</p>
        </div>

        <div className="card-2 card">
          <h3>Product</h3>
          <p>Features</p>
          <p>How it Works</p>
        </div>

        <div className="card-3 card">
          <h3>Company</h3>
          <p>About Us</p>
          <p>Contact</p>
        </div>

        <div className="card-4 card">
          <h3>Supports</h3>
          <p>Help Center</p>
          <p>Privacy Policy</p>
        </div>

        <div className="card-5 card">
         <h3> Follow Us</h3>
         <p><FaGithub size={22}/> <FaFacebook size={22}/> <FaInstagram size={22}/> <FaLinkedin size={22}/></p>
        </div>

      </footer>

      <div className='footer-tag-line'>
        <p>@2026 Friends Chat. All rights reserved.</p>
      </div>

    </div>
  )
}

export default Home;
