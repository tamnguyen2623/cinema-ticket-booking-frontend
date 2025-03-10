import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Dialog, DialogContent, DialogTitle, } from "@mui/material";
import { IconButton } from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import './egiftdetailcustomer.css';
import FloatingNavigation from "../../components/UtilityBar/FloatingNavigation";

const EgiftDetailCustomer = () => {



    // if (loading) return <p>Loading...</p>;
    // if (!movie) return <p>Movie not found</p>;

    return (
        <div className="movie-detail-container">
            <div className="movie-detail-header">
                <p className="movie-detail-title">EGIFT</p>
            </div>
            <div className="movie-detail-content">
                <div className="movie-detail-main-info">
                    <div className="detail-image">
                        <img src={'https://iguov8nhvyobj.vcdn.cloud/media/cinemas/cms//t/e/tet-2_1.jpg'} />
                        <button className="btn-book-ticket">Đặt Vé</button>
                    </div>
                    <div className="movie-detail-info">
                        <div className="movie-detail-name-wrapper">
                            <h2 className="movie-detail-name">Tết 2025</h2>
                        </div>
                        <div className="movie-detail-inf-wrapper">
                            <p><span className="label"> Thời lượng:</span> <span className="value"> phút</span></p>
                        </div>
                    </div>
                </div>
            </div>
            <FloatingNavigation />
        </div>

    );
};

export default EgiftDetailCustomer;
