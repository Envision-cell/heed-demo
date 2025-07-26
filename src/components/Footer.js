import React, { useEffect, useRef, useState } from 'react';
import './Footer.css';
import { FaInstagram, FaFacebook, FaLinkedin } from 'react-icons/fa';
import bgfooter from '../assets/footer-bg.mp4'; // Adjust the path if needed
import seamBridge from "../assets/seamBridge.webm"; // Adjust the path if needed

const Footer = React.forwardRef((props, ref) => {
  const newsletterRef = useRef(null);
  const [newsletterVisible, setNewsletterVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const subscribeToList = (email) =>
    new Promise((res) => setTimeout(() => res({ ok: true }), 600));

async function handleSubscribe() {
    if (!email.trim()) return alert('Please enter an email address.');

    try {
      const res = await fetch('http://localhost:5000/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type: 'Subscribed' }),
      });

      const result = await res.json();
      if (res.ok || result.success || res.status === 201) {
        alert('Thank you for subscribing!');
        setEmail('');
        console.log('Subscription successful:', result);
      } else {
        alert(result.error || 'Subscription failed. Please try again.');
        console.log('Subscription successful:', result);
      }
    } catch (err) {
      console.error('Newsletter Error:', err);
      alert('Something went wrong. Please try again later.');
    }
  }
    function handleKeyDown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSubscribe();
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setNewsletterVisible(entry.isIntersecting),
      { threshold: 0.3 }
    );
    if (newsletterRef.current) observer.observe(newsletterRef.current);
    return () => {
      if (newsletterRef.current) observer.unobserve(newsletterRef.current);
    };
  }, []);

  return (
    <footer ref={ref} className="footer">
        <video
  src={seamBridge}
  autoPlay
  loop
  muted
  playsInline
  className=".footer-seam-bridge seam-bridge--top"
/>

      {/* 🔹 Video Background */}
      <video className="footer-video-bg" autoPlay muted loop playsInline>
        <source src={bgfooter} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* 🔹 Mesh Overlay */}
      <div className="footer-video-overlay-mesh"></div>

      <div className="footer-container">
        {/* Contact Info */}
        <div className="footer-section">
          <h4>CONTACT&nbsp;US</h4>
          <p style={{fontSize: '14px' , color: '#fff',
    textShadow: '0 0 4px #0d1011ff, 0 0 10px #050e11ff'}}>
            Door&nbsp;No.&nbsp;1882, Wesley&nbsp;Road, 2nd&nbsp;Cross<br />
            Mandi&nbsp;Mohalla, Mysore, Karnataka, India&nbsp;–&nbsp;570001
          </p>
          <p style={{fontSize: '14px' , color: '#fff',
    textShadow: '0 0 4px #0d1011ff, 0 0 10px #050e11ff'}}> Phone.&nbsp;No.: +91&nbsp;97387&nbsp;88537</p>
          <p style={{fontSize: '14px' , color: '#fff',
    textShadow: '0 0 4px #0d1011ff, 0 0 10px #050e11ff'}}>Email: info@heedjetboards.com</p>
        </div>

        {/* Social Media */}
        <div className="footer-section">
          <h4>FOLLOW&nbsp;US</h4>
          <div className="social-icons">
            <a href="https://www.instagram.com/heed_jetboards/" target="_blank" rel="noreferrer" aria-label="Instagram"><FaInstagram size={28} style={{fontSize: '14px' , color: '#fff',
    textShadow: '0 0 4px #0d1011ff, 0 0 10px #050e11ff'}} /></a>
            <a href="https://www.facebook.com/profile.php?id=100086639356059" target="_blank" rel="noreferrer" aria-label="Facebook"><FaFacebook size={28} style={{fontSize: '14px' , color: '#fff',
    textShadow: '0 0 4px #0d1011ff, 0 0 10px #050e11ff'}}/></a>
            <a href="https://www.linkedin.com/company/heedjetboards/?viewAsMember=true" target="_blank" rel="noreferrer" aria-label="LinkedIn"><FaLinkedin size={28} style={{fontSize: '14px' , color: '#fff',
    textShadow: '0 0 4px #0d1011ff, 0 0 10px #050e11ff'}}/></a>
          </div>
        </div>

        {/* Newsletter with animation */}
        <div className={`footer-section newsletter-section ${newsletterVisible ? 'slide-in-left' : ''}`} ref={newsletterRef}>
          {/* <h4></h4>
          <p>.</p> */}
          <form
              onSubmit={async (e) => {
              e.preventDefault();
              const email = e.target.email.value;

              try {
                const response = await fetch('https://api.heedjetboards.com/users', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  /* ← added type */
                  body: JSON.stringify({ email, type: 'Subscribe' }),
                });

                const result = await response.json();
                if (response.ok && result.success) {
                  alert('Thank you for subscribing!');
                  console.log('Subscription successful:', result);

                  e.target.reset();
                } else {
                  alert(result.error || 'Subscription failed. Please try again.');
                  console.error('Subscription Error:', result);
                }
              } catch (err) {
                console.error('Newsletter Error:', err);
                alert('Something went wrong. Please try again later.');
              }
            }}
          >
          <input
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        required
      />

      {/* the span acting as a button */}
      <span
        role="button"
        tabIndex={0}
        onClick={handleSubscribe}
        onKeyDown={handleKeyDown}
        style={{
          marginTop: '10px',
          display: 'block',
          color: '#fff',
          cursor: 'pointer',
          userSelect: 'none',
          fontFamily: 'OCTA, sans-serif',
        }}
      >
        SUBSCRIBE
      </span>
          </form>
        </div>
      </div>

      {/* Footer Bottom Text with Slide-in Animation */}
      <div className="footer-bottom">
        <p className={`footer-bottom-text ${newsletterVisible ? 'slide-in-left' : ''}`}>
          © {new Date().getFullYear()} Heed&nbsp;Jetboards. All rights reserved.
        </p>
      </div>
    </footer>
  );
});

export default Footer;
