import React, { useEffect } from 'react'
import './styles/contact.css'
import { FaUser } from "react-icons/fa";
import { FaEnvelope } from "react-icons/fa";
import { MdSubject } from "react-icons/md";
import { FaRegCommentDots } from "react-icons/fa";
import { FaPaperPlane } from "react-icons/fa";
import { LuPhone, LuMapPin, LuClock } from "react-icons/lu";
import { LuHeadset } from "react-icons/lu";
import { BsChatDotsFill } from "react-icons/bs";
import { z } from "zod";
import { useState } from 'react';
import { useDispatch, useSelector } from "react-redux"
import { contact, clearContact } from "./../../api-calls/user/contactSlice"

const contactSchema =
  z.object(
    {
      name: z.string().trim().min(1, "Name is required").min(3, "Name must be at least 3 characters"),
      email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
      subject: z.string().trim().min(1, "Subject is required").min(3, "Subject must be at least 3 characters"),
      message: z.string().trim().min(1, "Message is required").min(10, "Message must be at least 10 characters")
    });

export default function Contact() {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [error, setError] = useState("");

  const dispatcher = useDispatch();

  const { contactLoading, contactMessage, contactError } = useSelector((state) => state.contactSlice);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) {
      setError("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("  ")
    dispatcher(clearContact());

    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    const contactRequest = {
      name: result.data.name,
      email: result.data.email,
      subject: result.data.subject,
      message: result.data.message
    };
    dispatcher(contact(contactRequest))
  }

 useEffect(() => {
  if (contactError) {
    setError(
      contactError.errors
        ? Object.values(contactError.errors)[0]
        : contactError.message
    );
  }

  if (contactMessage) {
    setError("");
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: ""
    });
  }
}, [contactError, contactMessage]);

  return (
    <div className="contact-page">
      <header className='contact-header-page'>

        <div className='contact-header-text-div'>
          <p id='contact-us'>CONTACT US</p>

          <h1 className='header-text'>We'd love to <span>hear from you!</span></h1>

          <p className='header-text-line'></p>

          <p id='contact-header-text-box'>Have questions, suggestions, or need help?
            Our team is here to assist you. Reach out to us
            and we'll get back to you as soon as possible.
          </p>
        </div>

        <form className='contact-header-form' onSubmit={handleSubmit}>

          <h2>Send us a message</h2>

          {error && (<p className="contact-form-error"> {error} </p>)}
          {contactMessage && (<p className="contact-form-success"> {contactMessage.message} </p>)}

          <div className="input-group-1">
            <div className='contact-inner-group-1'><span><FaUser size={16} /></span>
              <input name='name' type="text" placeholder='Your Name'
                value={formData.name} onChange={handleChange} /></div>

            <div className='contact-inner-group-1'><span><FaEnvelope size={16} /> </span>
              <input name='email' type="email" placeholder='Your Email'
                value={formData.email} onChange={handleChange}
              /></div>
          </div>

          <div className="input-group-2"> <span><MdSubject size={18} /></span>
            <input name='subject' type="text" placeholder='subject' value={formData.subject} onChange={handleChange} />
          </div>

          <div id='contact-form-textarea'> <span><FaRegCommentDots size={18} /></span>
            <textarea name='message' rows={5} placeholder='Your Message' value={formData.message} onChange={handleChange}></textarea>
          </div>

          <button
            className="contact-header-button"
            type="submit"
            disabled={contactLoading}
          >
            {contactLoading ? "Sending..." : "Send Message"}
            {!contactLoading && (
              <span>
                <FaPaperPlane size={18} />
              </span>
            )}
          </button>

        </form>

      </header>

      <main className='contact-main-page'>

        <div className="contact-page-card-1">
          <div className="contact-main-logo">
            <FaEnvelope size={22} />

          </div>
          <div className="contact-main-text">
            <h3>Email Us</h3>
            <p id='contact-main-p1'>friendschatsuppot@gmail.com</p>
            <p id='contact-main-p2'>We'll reply as soon as possible</p>
          </div>
        </div>

        <div className="contact-page-card-1">
          <div className="contact-main-logo">
            <LuPhone size={22} />
          </div>
          <div className="contact-main-text">
            <h3>Contact Us</h3>
            <p id='contact-main-p1'>+91 12345 6789</p>
            <p id='contact-main-p2'>Mon-Sat, 09:00 AM-06:00 PM</p>
          </div>
        </div>

        <div className="contact-page-card-1">
          <div className="contact-main-logo">
            <LuMapPin size={22} />
          </div>
          <div className="contact-main-text">
            <h3>Location</h3>
            <p id='contact-main-p1'>755022 Odisha Jajpur</p>
            <p id='contact-main-p2'>Odisha India</p>
          </div>
        </div>

        <div className="contact-page-card-1">
          <div className="contact-main-logo">
            <LuClock size={22} />
          </div>
          <div className="contact-main-text">
            <h3>Response Time</h3>
            <p id='contact-main-p1'>Usually within 24 hours</p>
            <p id='contact-main-p2'>We value your time</p>
          </div>
        </div>

        <div className='contact-main-headset'>
          <span> <LuHeadset size={26} /></span>
        </div>

      </main>

      <footer className="contact-footer-page">

        <div className="contact-footer-card-1">
          <div className="contact-footer-logo">
            <div id="logoColor"><BsChatDotsFill size={26} /></div>
            Friends Chat
          </div>
        </div>

        <div className="contact-footer-card-2">
          <p>&copy; Friends Chat. All rights reserved</p>
        </div>

        <div className="contact-footer-card-3">
          <p>Privacy Policy</p>
          <p>Terms and Service</p>
          <p>Help</p>
        </div>

      </footer>

    </div>
  );
}
