import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);

  useEffect(() => {
    if (location.pathname === "/") {
      setActivePath("/movielist");
    } else {
      setActivePath(location.pathname);
    }
  }, [location]);

  return (
    <nav className="navbar">
      <div className="header_service">
        <ul className="menu_service">
          <li>
            <NavLink
              to="/bookingticket"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              BOOK TICKET
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/movielist"
              className={activePath === "/movielist" ? "active" : ""}
            >
              MOVIES
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/myticket/:userId"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              MY TICKETS
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/promotions"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              PROMOTIONS
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contact"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              CONTACT
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/egiftcustomer"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              EGIFT
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;