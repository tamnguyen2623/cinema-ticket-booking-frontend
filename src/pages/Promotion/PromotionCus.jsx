import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";  // ✅ Import navigate

const PromotionCus = () => {
  const [promotions, setPromotions] = useState([]);
  const { auth } = useContext(AuthContext);
  const [expandedCategories, setExpandedCategories] = useState({});
  const navigate = useNavigate(); // ✅ Khai báo navigate

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await axios.get(`/promotion/`, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        setPromotions(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách khuyến mãi:", error);
      }
    };
    fetchPromotions();
  }, [auth.token]);

  // Hàm phân loại khuyến mãi theo category
  const getPromotionsByCategory = (category) => {
    return promotions.filter((promo) => promo.category === category);
  };

  return (
    <>
      <div className="hot_movies">
        <p className="title-unique">PROMOTION</p>
      </div>
      <div className="head-container mt-10">
        {["Hot Promotion", "Gift Movie", "Event Cinema"].map((category) => {
          const categoryPromotions = getPromotionsByCategory(category);
          const isExpanded = expandedCategories[category] || false;
          const displayedPromotions = isExpanded ? categoryPromotions : categoryPromotions.slice(0, 4);

          return (
            <div key={category} className="mb-8">
              <div className="flex items-center justify-between w-full mb-4">
                <h3 className="text-xl font-semibold">{category}</h3>

                {/* Chỉ hiển thị nút nếu có hơn 4 mục */}
                {categoryPromotions.length > 4 && (
                  <div
                    className="flex items-center space-x-1 cursor-pointer text-gray-600 hover:text-black transition"
                    onClick={() =>
                      setExpandedCategories((prev) => ({
                        ...prev,
                        [category]: !isExpanded,
                      }))
                    }
                  >
                    <span className="text-sm font-medium">{isExpanded ? "LESS" : "MORE"}</span>
                    <span className="text-lg">▶</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-4 gap-6">
                {displayedPromotions.map((promo) => (
                  <div 
                    key={promo._id} 
                    className="border rounded-lg shadow-lg p-4 flex flex-col items-center cursor-pointer hover:shadow-xl transition"
                    onClick={() => navigate(`/promotionCus/${promo._id}`)}  // ✅ Đúng vị trí của onClick
                  >
                    <div className="w-48 h-48 flex justify-center items-center overflow-hidden rounded-lg">
                      <img
                        src={promo.image}
                        alt={promo.name}
                        className="w-full h-full object-cover object-center"
                      />
                    </div>                <p className=" m-4 font-bold text-[#97866A] text-center">{promo.name}</p>

                    <p className="text-gray-500 text-sm mt-2">
                      {new Date(promo.dateStart).toLocaleDateString("vi-VN")} ~{" "}
                      {new Date(promo.dateEnd).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                ))}
              </div>

            </div>
          );
        })}
      </div>
    </>
  );
};

export default PromotionCus;
