import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import './profile.css';
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const [user, setUser] = useState(null);
    const [avatar, setAvatar] = useState(null);
    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(false);
    const [totalSpent, setTotalSpent] = useState(0); // ⬅️ Biến lưu tổng tiền vé
    const { auth } = useContext(AuthContext);
const navigate = useNavigate()
    // Fetch thông tin người dùng
    useEffect(() => {
        if (!auth?.token) return;

        axios.get("http://localhost:8080/auth/me", {
            headers: { Authorization: `Bearer ${auth.token}` },
        })
            .then((res) => {
                setUser(res.data.data);
                setAvatar(res.data.data.avatar);
                fetchTotalSpent(res.data.data._id); // ⬅️ Gọi API tổng tiền ngay sau khi lấy userId
            })
            .catch((err) => console.error("Lỗi khi tải thông tin:", err));
    }, [auth.token]);

    // Fetch tổng tiền vé đã mua
    const fetchTotalSpent = async (userId) => {
        try {
            const res = await axios.get(`http://localhost:8080/booking/user/total/${userId}`);
            setTotalSpent(res.data.totalSpent || 0);
        } catch (error) {
            console.error("Lỗi khi lấy tổng tiền:", error);
        }
    };

    // Xử lý chọn file ảnh
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    // Upload avatar
    const handleUpload = async () => {
        if (!preview) return alert("Please enter image!");

        const formData = new FormData();
        formData.append("avatar", document.getElementById("avatarInput").files[0]);

        setLoading(true);
        try {
            const res = await axios.post("http://localhost:8080/auth/upload-avatar", formData, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            setAvatar(res.data.avatar);
            alert("Upload success!");
        } catch (error) {
            console.error("Lỗi upload:", error);
            alert("Có lỗi xảy ra!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="header-title">
                <h2>Profile</h2>
            </div>
            <div className="profile-container">
                {/* Hiển thị avatar */}
                <div className="avatar">
                    <img
                        src={preview || avatar || "https://via.placeholder.com/150"}
                        alt="Avatar"
                        className="w-28 h-28 rounded-full mb-3"
                    />
                    <div className="avatar-buttons">
                    <label htmlFor="avatarInput" className="input-avatar">
                        Choose 
                    </label>

                    <input
                        type="file"
                        id="avatarInput"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    <button
                        onClick={handleUpload}
                        className="upload"
                        disabled={loading}
                    >
                        {loading ? "Đang tải..." : "Upload"}
                    </button>
                    </div>
                </div>
                <div className="profile-info">
                    {/* Hiển thị thông tin khách hàng */}
                    {user && (
                        <div className="mt-5">
                            <p><strong>Fullname:</strong> {user.fullname}</p>
                            <p><strong>Email: </strong>{user.email}</p>

                            <p className="detail" ><strong>Total:</strong> {totalSpent.toLocaleString()} $
                            
                            <button  onClick={()=> navigate(`/myticket/:userId`)}>Detail</button>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
