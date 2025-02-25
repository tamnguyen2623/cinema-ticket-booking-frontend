import React, { useState, useContext } from "react";
import { Link, useLocation, Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./AdminDashboard.css";
import axios from "axios";
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
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";

const DashBoard = () => {
  const location = useLocation();
  const { auth, setAuth } = useContext(AuthContext); // Lấy thông tin từ context
  const navigate = useNavigate();

  if (!auth.token || auth.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  const isActive = (path) => (location.pathname === path ? "active-link" : "");

  const [isLoggingOut, SetLoggingOut] = useState(false);
  const onLogout = async () => {
    try {
      SetLoggingOut(true);
      const response = await axios.get("/auth/logout");
      setAuth({ username: null, email: null, role: null, token: null });
      sessionStorage.clear();
      toast.success("Logout successful!", {
        position: "top-center",
        autoClose: 2000,
        pauseOnHover: false,
      });
      navigate("/movieshowing");

    } catch (error) {
      console.error(error);
      toast.error("Error", {
        position: "top-center",
        autoClose: 2000,
        pauseOnHover: false,
      });
    } finally {
      SetLoggingOut(false);
    }
  };
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
              <FontAwesomeIcon icon={faChartBar} className="menu-icon" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li className={`nav-link ${isActive("/admin/role")}`}>
            <Link to="/admin/role">
              <FontAwesomeIcon icon={faUser} className="menu-icon" />
              <span>Role</span>
            </Link>
          </li>
          <li className={`nav-link ${isActive("/admin/cinema")}`}>
            <Link to="/admin/cinema">
              <FontAwesomeIcon icon={faFilm} className="menu-icon" />
              <span>Cinema</span>
            </Link>
          </li>
          <li className={`nav-link ${isActive("/admin/movie")}`}>
            <Link to="/admin/movie">
              <FontAwesomeIcon icon={faFilm} className="menu-icon" />
              <span>Movie</span>
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
          <li className={`nav-link ${isActive("/admin/seat")}`}>
            <Link to="/admin/seat">
              <FontAwesomeIcon icon={faTicketAlt} className="menu-icon" />
              <span>Seat</span>
            </Link>
          </li>
          <li className={`nav-link ${isActive("/admin/booking")}`}>
            <Link to="/admin/">
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
          <li className={`nav-link ${isActive("/admin/showtime")}`}>
            <Link to="/admin/showtime">
              <FontAwesomeIcon icon={faGift} className="menu-icon" />
              <span>Showtime</span>
            </Link>
          </li>
          <li className={`nav-link ${isActive("/admin/voucher")}`}>
            <Link to="/admin/voucher">
              <FontAwesomeIcon icon={faGift} className="menu-icon" />
              <span>Voucher</span>
            </Link>
          </li>

          <li className={`nav-link ${isActive("/admin/movietype")}`}>
            <Link to="/admin/movietype">
              <FontAwesomeIcon icon={faGift} className="menu-icon" />
              <span>MovieType</span>
            </Link>
          </li>
          <li className={`nav-link ${isActive("/admin/combo")}`}>
            <Link to="/admin/combo">
              <FontAwesomeIcon icon={faGift} className="menu-icon" />
              <span>Combo</span>
            </Link>
          </li>
          <li className="nav-link button-logou">
            <Link to="/logout"
              onClick={() => onLogout()}
              className="logout-button"
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Processing..." : "Đăng Xuất"}</Link>

          </li>
        </ul>
      </div>
    </nav>
  );
};

export default DashBoard;
