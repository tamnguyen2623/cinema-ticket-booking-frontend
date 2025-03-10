import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import FloatingNavigation from "../../components/UtilityBar/FloatingNavigation";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./egiftcustomer.css";

const EgiftCustomer = () => {
    const images = [
        "https://iguov8nhvyobj.vcdn.cloud/media/cinemas/cms//t/e/tet-2_1.jpg",
        "https://iguov8nhvyobj.vcdn.cloud/media/cinemas/cms//t/e/tet-1.jpg",
        "https://iguov8nhvyobj.vcdn.cloud/media/cinemas/cms//v/a/valentine_valentine_m1.jpg",
        "https://iguov8nhvyobj.vcdn.cloud/media/cinemas/cms//l/o/love_valentine_m2.jpg",
        "https://iguov8nhvyobj.vcdn.cloud/media/cinemas/cms//t/h/thank_you_3-1.jpg"

    ];
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
                            <div className="title-egift">
                                <img className="avatar" src="/images/avatar.png" alt="Avatar" />
                                <h2 className="title">TẾT 2025</h2>
                            </div>
                            <button className="view-all">TẤT CẢ</button>
                        </div>
                        <Swiper
                            slidesPerView={2}
                            spaceBetween={-190}
                            navigation={true}
                            modules={[Navigation]}
                            className="egift-swiper"
                        >
                            {images.map((image, index) => (
                                <SwiperSlide key={index} className="egift-slide">
                                    <img src={image} alt={`Slide ${index + 1}`} className="egift-image" />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        <button className="btn btn-book">
                            <Link to={`/egiftdetailcustomer`}>
                                <p>Chi tiết</p>
                            </Link>
                        </button>
                    </div>
                    {/* <div className="egift">
                        <div className="space"></div>
                        <div className="egift-container">
                            <div className="title-egift">
                                <img className="avatar" src="/images/avatar.png" alt="Avatar" />
                                <h2 className="title">Thẻ Thính</h2>
                            </div>
                            <button className="view-all">TẤT CẢ</button>
                        </div>
                        <Swiper
                            slidesPerView={2}
                            spaceBetween={-190}
                            navigation={true}
                            modules={[Navigation]}
                            className="egift-swiper"
                        >
                            {images.slice(2).map((image, index) => (
                                <SwiperSlide key={index + 2} className="egift-slide">
                                    <img src={image} alt={`Slide ${index + 3}`} className="egift-image" />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div> */}
                </div>
            </div>
            <FloatingNavigation />
        </div >
    );
};

export default EgiftCustomer;
