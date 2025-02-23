import React, { useContext } from "react";
import { Link, useLocation, Navigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./AdminDashboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRightFromBracket,
  faFilm,
  faCalendarAlt,
  faTicketAlt,
  faClipboardList,
  faUsers,
  faChartBar,
  faCommentDots,
  faGift,
} from "@fortawesome/free-solid-svg-icons";

const DashBoard = () => {
  const location = useLocation();
  const { auth } = useContext(AuthContext);

  if (!auth.token || auth.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  const isActive = (path) => (location.pathname === path ? "active-link" : "");

  return (
    <nav className="sidebar">
      <header className="sidebar-header">
        <div className="profile">
          <img
            src="https://i.pravatar.cc/50"
            alt="User Avatar"
            className="avatar"
          />
          <div className="profile-text">
            <span className="name">{auth.username || "Admin"}</span>
            <span className="role">Admin</span>
          </div>
        </div>
      </header>

      <div className="menu-bar">
        <ul className="menu-links">
          <li className={`nav-link ${isActive("/admin/dashboard")}`}>
            <Link to="/admin/dashboard">
              <FontAwesomeIcon icon={faFilm} className="menu-icon" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li className={`nav-link ${isActive("/admin/cinema")}`}>
            <Link to="/admin/cinema">
              <FontAwesomeIcon icon={faFilm} className="menu-icon" />
              <span>Cinema</span>
            </Link>
          </li>
          <li className={`nav-link ${isActive("/admin/schedule")}`}>
            <Link to="/admin/schedule">
              <FontAwesomeIcon icon={faCalendarAlt} className="menu-icon" />
              <span>Schedule</span>
            </Link>
          </li>
          <li className={`nav-link ${isActive("/admin/ticketmanagement")}`}>
            <Link to="/admin/ticketmanagement">
              <FontAwesomeIcon icon={faTicketAlt} className="menu-icon" />
              <span>Ticket</span>
            </Link>
          </li>
          <li className={`nav-link ${isActive("/admin/room")}`}>
            <Link to="/admin/room">
              <FontAwesomeIcon icon={faTicketAlt} className="menu-icon" />
              <span>Room</span>
            </Link>
          </li>
          <li className={`nav-link ${isActive("/booking")}`}>
            <Link to="/booking">
              <FontAwesomeIcon icon={faClipboardList} className="menu-icon" />
              <span>Booking</span>
            </Link>
          </li>
          <li className={`nav-link ${isActive("/admin/user")}`}>
            <Link to="/admin/user">
              <FontAwesomeIcon icon={faUsers} className="menu-icon" />
              <span>Users</span>
            </Link>
          </li>
          <li className={`nav-link ${isActive("/admin/movieshowing")}`}>
            <Link to="/admin/movieshowing">
              <FontAwesomeIcon icon={faUsers} className="menu-icon" />
              <span>Movie Showing</span>
            </Link>
          </li>
          <li className={`nav-link ${isActive("/admin/revenue")}`}>
            <Link to="/admin/revenue">
              <FontAwesomeIcon icon={faChartBar} className="menu-icon" />
              <span>Revenue</span>
            </Link>
          </li>
          <li className={`nav-link ${isActive("/admin/feedback")}`}>
            <Link to="/admin/feedback">
              <FontAwesomeIcon icon={faCommentDots} className="menu-icon" />
              <span>Feedback</span>
            </Link>
          </li>
          <li className={`nav-link ${isActive("/admin/voucher")}`}>
            <Link to="/admin/voucher">
              <FontAwesomeIcon icon={faGift} className="menu-icon" />
              <span>Voucher</span>
            </Link>
          </li>
          <li className={`nav-link ${isActive("/showtime")}`}>
            <Link to="/showtime">
              <FontAwesomeIcon icon={faGift} className="menu-icon" />
              <span>Showtime</span>
            </Link>
          </li>
          <li className={`nav-link ${isActive("/movietype")}`}>
            <Link to="/movietype">
              <FontAwesomeIcon icon={faGift} className="menu-icon" />
              <span>MovieType</span>
            </Link>
          </li>
          <li className={`nav-link ${isActive("/combo")}`}>
            <Link to="/combo">
              <FontAwesomeIcon icon={faGift} className="menu-icon" />
              <span>Combo</span>
            </Link>
          </li>
          <li className="nav-link button-logou">
            <Link to="/logout">
              <FontAwesomeIcon
                icon={faRightFromBracket}
                className="logout-icon"
              />
              <span>Logout</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default DashBoard;
