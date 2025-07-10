import React, { useEffect, useRef, useState } from 'react';
import './Footer.css';
import { FaInstagram, FaFacebook, FaLinkedin } from 'react-icons/fa';
import bgfooter from '../assets/footer-bg.mp4'; // Adjust the path if needed

const Footer = React.forwardRef((props, ref) => {
  const newsletterRef = useRef(null);
  const [newsletterVisible, setNewsletterVisible] = useState(false);

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
          <p>
            Door&nbsp;No.&nbsp;1882, Wesley&nbsp;Road, 2nd&nbsp;Cross<br />
            Mandi&nbsp;Mohalla, Mysore, Karnataka, India&nbsp;–&nbsp;570001
          </p>
          <p>Phone.&nbsp;No.: +91&nbsp;97387&nbsp;88537</p>
        </div>

        {/* Social Media */}
        <div className="footer-section">
          <h4>FOLLOW&nbsp;US</h4>
          <div className="social-icons">
            <a href="https://www.instagram.com/heed_jetboards/" target="_blank" rel="noreferrer" aria-label="Instagram"><FaInstagram size={28} /></a>
            <a href="https://www.facebook.com/profile.php?id=100086639356059" target="_blank" rel="noreferrer" aria-label="Facebook"><FaFacebook size={28} /></a>
            <a href="https://www.linkedin.com/company/heedjetboards/?viewAsMember=true" target="_blank" rel="noreferrer" aria-label="LinkedIn"><FaLinkedin size={28} /></a>
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
                const response = await fetch('http://heedjetboards.com:3000/users', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ email }),
                });
                const result = await response.json();
                if (response.ok && result.success) {
                  alert('Thank you for subscribing!');
                  e.target.reset();
                } else {
                  alert(result.error || 'Subscription failed. Please try again.');
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
              placeholder="Your email"
              required
              style={{ padding: '8px', marginRight: '8px', width: '70%' }}
            />
            <button type="submit" style={{ padding: '8px 12px' }}>
              Subscribe
            </button>
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
