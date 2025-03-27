import { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import logo from '../../assets/logo.png';
import './Header.css';
import ChangePassword from "../../components/ChangePassword";
import ChangeUsername from "../../components/ChangeUsername";

const Header = () => {
    const { auth, setAuth } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoggingOut, SetLoggingOut] = useState(false);
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [isModalOTPOpen, setIsModalOTPOpen] = useState(false);
    const [isModalUsernameOpen, setIsModalUsernameOpen] = useState(false);

    const isActive = (path) => (location.pathname === path ? "active-link" : "");

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

    const showChangePasswordForm = () => {
        setIsModalOTPOpen(true);
    };

    return (
        <header className="header">
            <div className="header-top">
                <ul className="menu">
                    <li className={`${isActive("")}`}>
                        <Link onClick={showChangePasswordForm} className="support-link">Change Password</Link>
                    </li>
                    <li className={`${isActive("")}`}>
                        <Link onClick={() => setIsModalUsernameOpen(true)} className="support-link">Change Username</Link>
                    </li>
                    {auth.token ? (
                        <li>
                            <Link
                                to="/logout"
                                onClick={() => onLogout()}
                                className="logout-button"
                                disabled={isLoggingOut}
                            >
                                {isLoggingOut ? "Processing..." : "Logout"}
                            </Link>
                        </li>
                    ) : (
                        <li>
                            <Link to="/login" className="login-link">Login</Link>
                        </li>
                    )}
                    <li><Link to="/support" className="support-link">Support</Link></li>
                </ul>
            </div>

            <div className="header-image">
                <div className="logo-container">
                    <img src={logo} alt="Header" style={{ height: "90px" }} />
                </div>
                {auth.token ? (
                    <div className="user-menu" onClick={() => setDropdownOpen(!isDropdownOpen)}>
                        Welcome, <b>{auth.fullname || 'Guest'}</b>! ▼
                        {isDropdownOpen && (
                            <ul className="dropdown-menu">
                                <li><Link to="/profile">Trang cá nhân</Link></li>
                                <li><Link to="/egift">Egift</Link></li>
                            </ul>
                        )}
                    </div>
                ) : (
                    <div className="user-menu">Xin chào!</div>
                )}
            </div>

            {isModalOTPOpen && <ChangePassword auth={auth} onClose={() => setIsModalOTPOpen(false)} />}
            {isModalUsernameOpen && <ChangeUsername auth={auth} onClose={() => setIsModalUsernameOpen(false)} />}
        </header>
    );
};

export default Header;
