import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './AdminDashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faRightFromBracket,
    faFilm,
    faCalendarAlt,
    faTicketAlt,
    faClipboardList,
    faUsers,
    faChartBar,
    faCommentDots,
    faGift
} from '@fortawesome/free-solid-svg-icons';

const DashBroad = () => {
    const location = useLocation(); 

    const isActive = (path) => location.pathname === path ? "active-link" : "";

    return (
        <nav className='sidebar'>
            <header className="sidebar-header">
                <div className="profile">
                    <img src="https://i.pravatar.cc/50" alt="User Avatar" className="avatar" />
                    <div className="profile-text">
                        <span className="name">Huỳnh Tuấn Kiệt</span>
                        <span className="role">Admin</span>
                    </div>
                </div>
            </header>


            <div className='menu-bar'>
                <ul className='menu-links'>
                <li className={`nav-link ${isActive('/dashboard')}`}>
                        <Link to="/dashboard">
                            <FontAwesomeIcon icon={faFilm} className="menu-icon" />
                            <span>DashBoard</span>
                        </Link>
                    </li>
                    <li className={`nav-link ${isActive('/cinema')}`}>
                        <Link to="/cinema">
                            <FontAwesomeIcon icon={faFilm} className="menu-icon" />
                            <span>Cinema</span>
                        </Link>
                    </li>
                    <li className={`nav-link ${isActive('/schedule')}`}>
                        <Link to="/schedule">
                            <FontAwesomeIcon icon={faCalendarAlt} className="menu-icon" />
                            <span>Schedule</span>
                        </Link>
                    </li>
                    <li className={`nav-link ${isActive('/ticket')}`}>
                        <Link to="/ticket">
                            <FontAwesomeIcon icon={faTicketAlt} className="menu-icon" />
                            <span>Ticket</span>
                        </Link>
                    </li>
                    <li className={`nav-link ${isActive('/booking')}`}>
                        <Link to="/booking">
                            <FontAwesomeIcon icon={faClipboardList} className="menu-icon" />
                            <span>Booking</span>
                        </Link>
                    </li>
                    <li className={`nav-link ${isActive('/booking')}`}>
                        <Link to="/booking">
                            <FontAwesomeIcon icon={faClipboardList} className="menu-icon" />
                            <span>Huỳnh Kiệt</span>
                        </Link>
                    </li>
                    <li className={`nav-link ${isActive('/role')}`}>
                        <Link to="/role">
                            <FontAwesomeIcon icon={faUsers} className="menu-icon" />
                            <span>Role</span>
                        </Link>
                    </li>
                    <li className={`nav-link ${isActive('/revenue')}`}>
                        <Link to="/revenue">
                            <FontAwesomeIcon icon={faChartBar} className="menu-icon" />
                            <span>Revenue</span>
                        </Link>
                    </li>
                    <li className={`nav-link ${isActive('/feedback')}`}>
                        <Link to="/feedback">
                            <FontAwesomeIcon icon={faCommentDots} className="menu-icon" />
                            <span>Feedback</span>
                        </Link>
                    </li>
                    <li className={`nav-link ${isActive('/voucher')}`}>
                        <Link to="/voucher">
                            <FontAwesomeIcon icon={faGift} className="menu-icon" />
                            <span>Voucher</span>
                        </Link>
                    </li>
                    <li className='nav-link button-logou'>
                        <Link to="/logout">
                            <FontAwesomeIcon icon={faRightFromBracket} className="logout-icon" />
                            <span>Logout</span>
                        </Link>
                    </li>
                </ul>

            </div>
        </nav>
    );
};

export default DashBroad;
