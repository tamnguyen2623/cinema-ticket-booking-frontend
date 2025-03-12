import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { IconButton } from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import './egiftdetailcustomer.css';
import FloatingNavigation from "../../components/UtilityBar/FloatingNavigation";

const EgiftDetailCustomer = () => {
    const { id } = useParams();
    const [egift, setEgift] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEgift = async () => {
            try {
                const response = await axios.get(`/egift/egifts/${id}`);
                if (response.data && response.data.data) {
                    setEgift(response.data.data);
                } else {
                    setEgift(null);
                }
            } catch (error) {
                setError("Lỗi khi lấy dữ liệu!");
            } finally {
                setLoading(false);
            }
        };

        fetchEgift();
    }, [id]);

    if (loading) return <p className="loading-message">Đang tải...</p>;
    if (error) return <p className="error-message">{error}</p>;
    if (!egift) {
        return (
            <div className="no-data-container">
                <p className="no-data-message">Không có dữ liệu!</p>
            </div>
        );
    }
    return (
        <div className="movie-detail-container">
            <div className="movie-detail-header">
                <p className="movie-detail-title">EGIFT</p>
            </div>
            <div className="movie-detail-content">
                <div className="movie-detail-main-info">
                    <div className="detail-images">
                        <img src={egift?.image} alt={egift?.name} />
                        <button className="btn-book-ticket">Buy card</button>
                    </div>
                    <div className="movie-detail-info">
                        <div className="movie-detail-name-wrapper">
                            <h2 className="movie-detail-name">{egift?.name}</h2>
                        </div>
                        <div className="movie-detail-inf-wrapper">
                            <p><span className="label">Description:</span> <span className="value">{egift?.description}</span></p>
                        </div>
                    </div>
                </div>
            </div>
            <FloatingNavigation />
        </div>
    );
};

export default EgiftDetailCustomer;
