import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import './Navbar.css';

const Navbar = () => {
    const location = useLocation();
    const [activePath, setActivePath] = useState(location.pathname);

    useEffect(() => {
        if (location.pathname === '/') {
            setActivePath('/movie');
        } else {
            setActivePath(location.pathname);
        }
    }, [location]);

    return (
        <nav className="navbar">
            <div className='header_service'>
                <ul className="menu_service">
                    <li><NavLink to="/booking" className={({ isActive }) => isActive ? "active" : ""}>MUA VÉ</NavLink></li>
                    <li><NavLink to="/movie" className={activePath === '/movie' ? "active" : ""}>PHIM</NavLink></li>
                    <li><NavLink to="/promotions" className={({ isActive }) => isActive ? "active" : ""}>KHUYẾN MÃI</NavLink></li>
                    <li><NavLink to="/contact" className={({ isActive }) => isActive ? "active" : ""}>LIÊN HỆ</NavLink></li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
