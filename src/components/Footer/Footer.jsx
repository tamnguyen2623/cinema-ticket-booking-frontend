import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            {/* Banners Section */}
            <div className="footer-banners">
                <div className="banner">
                    <img
                        src="https://media.lottecinemavn.com/Media/WebAdmin/d3c9eea3982c46a09c9d9073cb6d2c17.jpg"
                        alt="Advertisement Banner"
                    />
                </div>
                <div className="banner-secondary">
                    <img
                        src="https://media.lottecinemavn.com/Media/WebAdmin/d79908c7a0ce4c68b0363ff46a4bc575.jpg"
                        alt="Cinema Promotions"
                    />
                </div>
            </div>

            {/* Footer Content */}
            <div className="footer-container">
                <div className="footer-section">
                    <h4>About Us</h4>
                    <p>
                        A modern cinema system with a luxurious space, immersive sound, high-quality screens, 
                        and professional services. We provide online ticket booking, comfortable waiting areas, 
                        and a dedicated team to bring you a complete cinematic experience.
                    </p>
                </div>

                <nav className="footer-section">
                    <h4>Links</h4>
                    <ul>
                        <li><a>About Us</a></li>
                        <li><a>Privacy Policy</a></li>
                        <li><a>Terms of Use</a></li>
                        <li><a>Contact</a></li>
                    </ul>
                </nav>

                <div className="footer-section">
                    <h4>Follow Us</h4>
                    <div className="social-icons">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                            <FaFacebookF />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                            <FaTwitter />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            <FaInstagram />
                        </a>
                        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                            <FaYoutube />
                        </a>
                    </div>
                </div>
            </div>

            {/* Footer Bottom */}
            <div className="footer-bottom">
                <p>&copy; 2025 Cinema. All Rights Reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
