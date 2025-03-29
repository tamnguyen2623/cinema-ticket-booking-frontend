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

    <div>
      <div className="hot_movies">
        <p className="title-unique">PROFILE</p>
      </div>
      <div className="max-w-[1000px] mx-auto bg-white shadow-lg rounded-lg p-6 mt-6 mb-6">
        {/* Avatar + Form */}
        <div className="flex flex-col md:flex-row items-center gap-6 mt-6 mb-6">
          {/* Avatar */}
          <div className="flex flex-col items-center">
            <img
              src={preview || avatar || "https://i.pinimg.com/474x/7e/7f/d0/7e7fd01f87a51b390e051e83340b7d78.jpg"}
              alt="Avatar"
              className="w-32 h-32 rounded-full border-4 border-gray-300 shadow-md"
            />
            <label htmlFor="avatarInput" className="mt-3 px-4 py-2 rounded-md cursor-pointer font-bold" style={{backgroundColor: "#DAD2B4", color: "#231F20"}}>
Choose image            </label>
            <input
              type="file"
              id="avatarInput"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Form Thông Tin */}
          <div className="flex-1 w-full ">

            {user && (
              <div className="space-y-4">
                {/* Họ tên */}
                <div className="flex flex-col gap-2">
                  <label className="text-gray-600 font-medium">Fullname:</label>
                  <input
                    type="text"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                    placeholder="Nhập họ tên"
                  />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-2">
                  <label className="text-gray-600 font-medium">Email:</label>
                  <p className="text-gray-700 bg-gray-100 px-3 py-2 rounded-md">{user.email}</p>
                </div>

                {/* Tổng chi tiêu */}
                <div className="flex items-center justify-between bg-gray-100 p-4 rounded-md">
                  <p className="text-lg font-medium">
                    Total: <span className="font-bold" style={{color: "#231F20"}}>{totalSpent.toLocaleString()} $</span>
                  </p>
                  <button
                    onClick={() => navigate(`/myticket/${user.id}`)}
                    className="px-4 py-2 rounded-md font-bold"
                    style={{backgroundColor: "#DAD2B4", color: "#231F20"}}
                  >
Detail tickets                  </button>
                </div>

                {/* Nút cập nhật thông tin */}
                <button
                  onClick={handleUpdateProfile}
                  className="w-full px-5 py-3 rounded-md transition flex items-center justify-center font-bold"
                  style={{backgroundColor: "#DAD2B4", color: "#231F20"}}
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update information"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>



      </div>
  );
};

export default Profile;
