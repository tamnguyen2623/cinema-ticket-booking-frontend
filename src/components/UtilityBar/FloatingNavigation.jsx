import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaTicketAlt, FaMapMarkerAlt, FaHeadset } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./FloatingNavigation.css";

const FloatingNavigation = () => {
  const [position, setPosition] = useState(window.innerHeight * 0.7);
  let scrollTimeout = null;
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const newPosition = scrollY + viewportHeight * 0.5;

      setPosition(newPosition);
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setPosition(scrollY + viewportHeight * 0.5);
      }, 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, []);

  return (
    <div className="navigation-container" style={{ top: `${position}px` }}>
      <ul className="navigation-list">
        <li>
          <Link
            onClick={() => {
              navigate("/bookingticket");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <FaTicketAlt className="icon" />
            <p>Quick Booking</p>
          </Link>
        </li>
        <li>
          <Link
            onClick={() => {
              navigate("/contact");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <FaMapMarkerAlt className="icon" />
            <p>Where to Book</p>
          </Link>
        </li>
        <li>
          <Link
            onClick={() => {
              navigate("/support");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <FaHeadset className="icon" />
            <p>Support</p>
          </Link>
        </li>
      </ul>
      <button
        className="back-to-top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        TOP <span className="arrow-up"></span>
      </button>
    </div>
  );
};

export default FloatingNavigation;
