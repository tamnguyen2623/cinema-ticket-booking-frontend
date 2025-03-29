import React, { useEffect, useState, useContext } from "react";
import { NavLink, useLocation } from "react-router-dom";
import "./Navbar.css";
import { AuthContext } from "../../context/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const [activePath, setActivePath] = useState(location.pathname);
  const { auth } = useContext(AuthContext);

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
          {auth.token && (
            <li>
              <NavLink
                to="/myticket/:userId"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                MY TICKETS
              </NavLink>
            </li>
          )}
          <li>
            <NavLink
              to="/promotionCus"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              PROMOTIONS
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/service"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              SERVICE
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
          <li>
            <NavLink
              to="/support"
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              SUPPORT QUESTION
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
