import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="banner">
                <img
                    src="https://media.lottecinemavn.com/Media/WebAdmin/996f01f99996459eb258b7d0487c6cd7.jpg"
                    alt="Banner quảng cáo"
                />
            </div>

            <div className="banner-secondary">
                <img
                    src="https://media.lottecinemavn.com/Media/WebAdmin/9754b3be0cdc4bee9771fdbad2fd35f8.png"
                    alt="Khuyến mãi rạp chiếu phim"
                />
            </div>
            <div className="footer-container">
                <div className="footer-section">
                    <h4>Về Chúng Tôi</h4>
                    <p>
                        Hệ thống rạp chiếu phim hiện đại với không gian sang trọng, âm thanh sống động,
                        màn hình chất lượng cao và dịch vụ chuyên nghiệp. Chúng tôi cung cấp đặt vé trực
                        tuyến, khu vực chờ tiện nghi, cùng đội ngũ nhân viên tận tâm, mang đến trải nghiệm
                        điện ảnh trọn vẹn.
                    </p>
                </div>
                <div className="footer-section">
                    <h4>Liên Kết</h4>
                    <ul>
                        <li><Link to="/about">Giới thiệu</Link></li>
                        <li><Link to="/policy">Chính sách bảo mật</Link></li>
                        <li><Link to="/terms">Điều khoản sử dụng</Link></li>
                        <li><Link to="/contact">Liên hệ</Link></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h4>Theo Dõi Chúng Tôi</h4>
                    <div className="social-icons">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2025 Rạp Chiếu Phim. All Rights Reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;

