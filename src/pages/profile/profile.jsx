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
  const [fullname, setFullname] = useState(""); // State mới để lưu tên mới
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
        setFullname(res.data.data.fullname); // Set fullname vào state
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
  const handleUpdateProfile = async () => {
    setLoading(true);

    try {
      let uploadedAvatar = avatar;

      // Nếu có ảnh mới được chọn, thực hiện upload trước
      if (preview) {
        const formData = new FormData();
        formData.append("avatar", document.getElementById("avatarInput").files[0]);

        const resAvatar = await axios.post("http://localhost:8080/auth/upload-avatar", formData, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });

        uploadedAvatar = resAvatar.data.avatar; // Cập nhật avatar mới
      }

      // Cập nhật fullname và avatar trong hồ sơ
      const res = await axios.put(
        `http://localhost:8080/auth/profile/user/${user._id}`,
        { fullname, avatar: uploadedAvatar },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );

      setUser({ ...user, fullname: res.data.fullname, avatar: uploadedAvatar });
      setAvatar(uploadedAvatar);
      setPreview(""); // Xóa preview sau khi upload xong
      alert("Cập nhật thành công!");
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin:", error);
      alert("Có lỗi xảy ra!");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="container">
      <div className="header-title">
        <h2>Hồ sơ cá nhân</h2>
      </div>
      <div className="profile-container">
        {/* Hiển thị avatar */}
        <div className="avatar-profile">
          <img
            src={preview || avatar || "https://i.pinimg.com/474x/7e/7f/d0/7e7fd01f87a51b390e051e83340b7d78.jpg"}
            alt="Avatar"
            className="w-28 h-28 rounded-full mb-3"
          />
          <div className="avatar-buttons">
            <label htmlFor="avatarInput" className="input-avatar">
              Chọn ảnh
            </label>

            <input
              type="file"
              id="avatarInput"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

          </div>
        </div>
        <div className="profile-info">
          {/* Hiển thị thông tin khách hàng */}
          {user && (
            <div className="mt-5 space-y-4">
              {/* Cập nhật họ tên */}
              <div className="flex items-center gap-3">
                <strong>Tên:</strong>
                <input
                  type="text"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  className="border border-gray-300 px-2 py-1 rounded w-full max-w-xs"
                />

              </div>

              {/* Hiển thị Email */}
              <p><strong>Email:</strong> {user.email}</p>

              {/* Hiển thị tổng số tiền đã mua vé */}
              <div className="flex items-center gap-4 rounded">

                <p><strong>Total:</strong> {totalSpent.toLocaleString()} $</p>
                <button
                  onClick={() => navigate(`/myticket/${user.id}`)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                  Chi tiết
                </button>
              </div>
              <button
                onClick={handleUpdateProfile}
                className="bg-blue-500 text-white px-5 py-2 rounded hover:bg-blue-600 transition flex items-center justify-center"
                disabled={loading}
              >
                {loading ? "Loading..." : "Update Profile"}
              </button>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Profile;
