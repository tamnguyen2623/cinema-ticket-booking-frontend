import { Link } from "react-router-dom";
import './Header.css'

const Header = () => {
    return (
        <header className="header">
            <div className="header-top">
                <ul className="menu">
                    <li><Link to="/login" className="login-link">Đăng nhập</Link></li>
                    <li><Link to="/membership" className="membership-link">Thẻ thành viên</Link></li>
                    <li><Link to="/support" className="support-link">Hỗ trợ khách hàng</Link></li>
                </ul>
            </div>

            <div className="header-image">     
                <img 
                    src="https://media.lottecinemavn.com/Media/WebAdmin/ccc95ee5b9274a12ba3e51317250dcbe.png" 
                    alt="Header" 
                />
            </div>
        </header>
    );
};

export default Header;
