import React from 'react'
import Navbar from './Navbar';
import './styles/about.css'
import AboutImg from "../../assets/Friends.png"
import Connection from "../../assets/connection.png"
import Organize from "../../assets/organize.png"
import Merge from "../../assets/Merge.png"
import MessageIcon from "../../assets/Messageicon.png"
import Update from "../../assets/update.png"

const About = () => {
  return (
    
      <main id="about-mainWrapper">
        <article className="about-hero">
          <section className="about-hero-top">
            <section className="about-left-text">
              <p id="about-heading">About <span id="about-span">Friends Chat</span></p>
              <hr />
              <p id="about-desc-text">
                Friends Chat helps you keep your friends organized in one place.
                You can add your friends, view your connections clearly, and
                manage your social circle easily. Managing friends can get
                confusing. Friends Chat makes it simple by showing your
                connections in a clear and structured way so you never lose track
                of important people.
              </p>
            </section>

            <img src={AboutImg} alt="" />
          </section>

          <section className="about-hero-mid">
            <hr id="about-hr2" />
            <span className="about-dot">•</span>
            <p id="about-text-qs">
              What Will <span id="about-friend-chat-qs">Friends Chat</span> Do?
            </p>
            <span className="about-dot">•</span>
            <hr id="about-hr3" />
          </section>

          <section className="about-hero-bottom">

            <section className="about-card">
              <img src={Organize} alt="" />
              <span className="about-card-head">Organize Friends</span>
              <p className="about-card-desc">
                Add and organize your friends in groups for quick and easy access
                anytime.
              </p>
            </section>

            <section className="about-card">
              <img src={Connection} alt="" />
              <span className="about-card-head">View Connections</span>
              <p className="about-card-desc">
                See your connections clearly and understand your social circle
                better.
              </p>
            </section>

            <section className="about-card">
              <img src={Merge} alt="" />
              <span className="about-card-head">Manage Easily</span>
              <p className="about-card-desc">
                Update, sort, and manage your friends and connections in just a
                few taps.
              </p>
            </section>

            <section className="about-card">
              <img src={Update} alt="" />
              <span className="about-card-head">Stay Updated</span>
              <p className="about-card-desc">
                Get important updates and never miss out on what matters most.
              </p>
            </section>

          </section>
        </article>

        <footer className="about-footer">
          <section className="about-footer-left">

            <section className="about-foot-msg-logo">
              <img src={MessageIcon} alt="" />
            </section>

            <section className="about-foot-text">
              <p id="about-fp1">
                Friends come and go, but real connections stay forever.
              </p>

              <p id="about-fp2">
                Friends Chat helps you keep those connections strong and
                meaningful.
              </p>
            </section>

          </section>

          <button>Start Connecting</button>

        </footer>

      </main>

  )
}

export default About;