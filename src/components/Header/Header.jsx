import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import './Header.css'

const Header = () => {
    const { auth, setAuth } = useContext(AuthContext); // Lấy thông tin từ context
    const navigate = useNavigate();

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
                                {isLoggingOut ? "Processing..." : "Đăng Xuất"}</Link>
                        </li>
                    ) : (
                        <li>
                            <Link to="/login" className="login-link">Đăng nhập</Link>
                        </li>
                    )}
                    <li><Link to="/membership" className="membership-link">Thẻ thành viên</Link></li>
                    <li><Link to="/support" className="support-link">Hỗ trợ khách hàng</Link></li>
                </ul>
            </div>

            <div className="header-image">
                <div className="logo-container">
                    <img
                        src="https://media.lottecinemavn.com/Media/WebAdmin/ccc95ee5b9274a12ba3e51317250dcbe.png"
                        alt="Header"
                    />
                </div>
                {auth && (
                    <div className="border-text">
                        Xin chào <b>{auth.fullname}</b>! ▼
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
