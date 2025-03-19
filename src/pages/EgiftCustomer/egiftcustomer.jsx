import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import FloatingNavigation from "../../components/UtilityBar/FloatingNavigation";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./egiftcustomer.css";

const EgiftCustomer = () => {
    const [egifts, setEgifts] = useState([]);
    useEffect(() => {
        fetchEgifts();
    }, []);
    const fetchEgifts = async () => {
        try {
            const response = await axios.get(`/egift/egifts`);
            const data = response.data.data;
            console.log("Dữ liệu từ API:", response.data.data);

            const validEgifts = Array.isArray(data) ? data.filter(item => !item.isDelete) : [];
            setEgifts(validEgifts);
            console.log("Dữ liệu từ API:", validEgifts);

            // Kiểm tra nếu API trả về dữ liệu không phải là mảng, đặt giá trị mặc định là []
            // setEgifts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu eGift:", error);
            setEgifts([]); // Nếu lỗi, đặt egifts thành mảng rỗng để tránh lỗi .map()
        }
    };

    return (
        <div classNam="movie-list">
            <div className="hot_movies">
                <p className="title">EGIFT</p>
            </div>
            <div className="screen_cwrap">
                <div className="movie-list">
                    <div className="egift">
                        <div className="space"></div>
                        <div className="egift-container">
                        </div>
                        {egifts.length === 0 ? (
                            <p className="no-data">No eGift data.</p>
                        ) : (
                            <Swiper
                                slidesPerView={1}
                                spaceBetween={-490}
                                navigation={true}
                                modules={[Navigation]}
                                className="egift-swiper"
                            >
                                {egifts.map((egift) => (
                                    <SwiperSlide key={egift._id} className="egift-slide">
                                        <Link to={`/egiftdetailcustomer/${egift._id}`}>
                                            <img src={egift.image} alt={egift.name} className="egift-image" />
                                        </Link>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        )}
                    </div>
                </div>
            </div>
            <FloatingNavigation />
        </div >
    );
};

export default EgiftCustomer;
