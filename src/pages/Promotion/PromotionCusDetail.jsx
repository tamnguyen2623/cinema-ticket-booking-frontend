import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom"; // ✅ Lấy id từ URL

const PromotionCusDetail = () => {
    const [promotion, setPromotion] = useState(null);
    const { auth } = useContext(AuthContext);
    const { id } = useParams(); // Lấy id từ URL
    const navigate = useNavigate();
    useEffect(() => {
        const fetchPromotion = async () => {
            try {
                const response = await axios.get(`/promotion/${id}`, {
                    headers: { Authorization: `Bearer ${auth.token}` },
                });
                console.log("Dữ liệu API:", response.data); // Kiểm tra dữ liệu nhận được
                setPromotion(response.data.data); //  API trả về { success: true, data: { ... } }
            } catch (error) {
                console.error("Lỗi lấy dữ liệu khuyến mãi:", error);
            }
        };

        fetchPromotion();
    }, [id]);
    const formatDescription = (desc) => {
        return desc
            .replace(/\n/g, "<br>") // Xuống dòng
            .replace(/\*([^*]+)\*/g, "<strong>$1</strong>") // Chữ trong dấu * sẽ in đậm
            .replace(/- (.+)/g, "<li>$1</li>") // Chuyển "- " thành danh sách <li>
            .replace(/(<li>.*?<\/li>)+/g, "<ul>$&</ul>"); // Gói tất cả <li> vào <ul>
    };
    if (!promotion) return <p>Loading...</p>; //  Hiển thị loading nếu chưa có dữ liệu

    return (
        <>
            <div className="hot_movies">
                <p className="title-unique">PROMOTION DETAIL</p>
            </div>

            <div className="head-container max-w-[800px] mx-auto flex flex-col items-center">
                {/* Hình ảnh */}                    
                <p className="text-4xl m-4 font-bold text-[#97866A] text-center">{promotion.name}</p>

                <div className="w-full flex justify-center">
                    <div className="w-full max-w-[600px] h-auto overflow-hidden rounded-lg">
                        <img
                            src={promotion.image}
                            alt={promotion.name}
                            className="w-full h-auto object-cover"
                        />
                    </div>
                </div>

                {/* Chi tiết thêm */}
                <div className="mt-6 p-5 border rounded-lg w-full  shadow-md">
                    <p className="text-lg text-gray-800">
                        <strong>Description </strong>
                        <span dangerouslySetInnerHTML={{ __html: formatDescription(promotion.description) }} />
                    </p>                    <p className="text-lg text-gray-800"><strong>Start:</strong> {new Date(promotion.createdAt).toLocaleDateString("vi-VN")}</p>
                    <p className="text-lg text-gray-800"><strong>End:</strong> {new Date(promotion.updatedAt).toLocaleDateString("vi-VN")}</p>
                </div>

                {/* Nút Back */}
                <div className="mt-6">
                    <button
                        className="px-6 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-400 transition"
                        onClick={() => navigate("/promotionCus")}
                    >
                        Back
                    </button>
                    {/* Liên kết qua trang đặt vé */}
                    <button
                        className="ml-4 px-6 py-2 bg-[#97866A] text-white font-semibold rounded-lg shadow-md hover:bg-[#97866A] transition"
                        onClick={() => navigate("/bookingticket")}
                        >
                        Book Now
                        </button>
                </div>
            </div>

        </>
    );
};

export default PromotionCusDetail;
