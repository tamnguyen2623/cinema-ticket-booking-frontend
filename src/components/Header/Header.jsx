import { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import logo from '../../assets/logo.png'
import './Header.css'
import { Height } from "@mui/icons-material";

const Header = () => {
    const { auth, setAuth } = useContext(AuthContext);
    const navigate = useNavigate();
    console.log(auth);

    const [isLoggingOut, SetLoggingOut] = useState(false);
    const [isDropdownOpen, setDropdownOpen] = useState(false);

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
        <header className="header">
            <div className="header-top">
                <ul className="menu">
                    {auth.token ? (
                        <li>
                            <Link to="/logout"
                                onClick={() => onLogout()}
                                className="logout-button"
                                disabled={isLoggingOut}
                            >
                                {isLoggingOut ? "Processing..." : "Logout"}</Link>
                        </li>
                    ) : (
                        <li>
                            <Link to="/login" className="login-link">Login</Link>
                        </li>
                    )}
                    {/* <li><Link to="/membership" className="membership-link">Thẻ thành viên</Link></li> */}
                    <li><Link to="/support" className="support-link">Support</Link></li>
                </ul>
            </div>

            <div className="header-image">
                <div className="logo-container">
                    <img
                        src={logo}
                        alt="Header"
                        style={{ height: "90px" }}
                    />
                </div>
                {auth.token ? (
                    <div className="user-menu" onClick={() => setDropdownOpen(!isDropdownOpen)}>
                        Welcome, <b>{auth.fullname}</b>! ▼
                        {isDropdownOpen && (
                            <ul className="dropdown-menu">
                                <li><Link to="/profile">Trang cá nhân</Link></li>
                                <li><Link to="/egift">Egift</Link></li>
                            </ul>
                        )}
                    </div>
                ) : (
                    <div className="user-menu">
                        Xin chào!
                    </div>
                )}

            </div>
        </header>
    );
};

export default Header;