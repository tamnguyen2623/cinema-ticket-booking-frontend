import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Dialog, DialogContent, DialogTitle, } from "@mui/material";
import { IconButton } from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import './DetailMovie.css';
import FloatingNavigation from "../UtilityBar/FloatingNavigation";

const MovieDetail = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [openTrailer, setOpenTrailer] = useState(false);
    const navigate = useNavigate();



    useEffect(() => {
        axios.get(`http://localhost:8080/movie/${id}`)
            .then(response => {
                setMovie(response.data.data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching movie:", error);
                setLoading(false);
            });
    }, [id]);


    const handleBookTicket = () => {
        navigate("/booking", { state: { selectedMovie: movie } });
    };


    const feedbackData = [
        {
            id: 1,
            content: "Phim rất hay, đáng xem!",
            role: "viewer",
            stars: 5,
            username: "Nguyễn Văn A",
            date: "2024-02-10",
        },
        {
            id: 2,
            content: "Tình tiết hấp dẫn nhưng kết hơi khó hiểu.",
            role: "viewer",
            stars: 4,
            username: "Trần Thị B",
            date: "2024-02-11",
        },
        {
            id: 3,
            content: "Phim quá dài, xem hơi chán.",
            role: "viewer",
            stars: 2,
            username: "Lê Hoàng C",
            date: "2024-02-12",
        },
        {
            id: 4,
            content: "Hình ảnh đẹp, diễn viên diễn xuất tốt.",
            role: "critic",
            stars: 5,
            username: "Phan Minh D",
            date: "2024-02-13",
        },
        {
            id: 5,
            content: "Không đúng nguyên tác, thất vọng!",
            role: "viewer",
            stars: 1,
            username: "Hoàng Anh E",
            date: "2024-02-14",
        },
        {
            id: 6,
            content: "Nhạc phim tuyệt vời, tạo cảm xúc mạnh.",
            role: "critic",
            stars: 4,
            username: "Mai Quỳnh F",
            date: "2024-02-15",
        },
        {
            id: 7,
            content: "Cảnh hành động quá đỉnh, đáng xem lại.",
            role: "viewer",
            stars: 5,
            username: "Đặng Hữu G",
            date: "2024-02-16",
        },
        {
            id: 8,
            content: "Kịch bản hơi yếu nhưng diễn xuất bù lại được.",
            role: "viewer",
            stars: 3,
            username: "Vũ Thanh H",
            date: "2024-02-17",
        },
    ];


    if (loading) return <p>Loading...</p>;
    if (!movie) return <p>Movie not found</p>;

    return (
        <div className="movie-detail-container">
            <div className="movie-detail-header">
                <p className="movie-detail-title">PHIM HOT TẠI RẠP</p>
            </div>
            <div className="trailer-modal" onClick={() => setOpenTrailer(true)}>
                <div className="movie-trailer-container">
                    <img src={movie.img} alt={movie.title} className="movie-image-trailer" />
                    <PlayCircleOutlineIcon className="play-icon" sx={{ fontSize: "80px", cursor: "pointer" }} />
                </div>
            </div>

            <Dialog open={openTrailer} onClose={() => setOpenTrailer(false)} maxWidth="md" fullWidth className="custom-modal">

                <div className="modal-header">
                    <DialogTitle>Trailer - {movie.name}</DialogTitle>
                    <IconButton
                        className="close-button"
                        onClick={() => setOpenTrailer(false)}
                        sx={{ color: "white" }}
                    >
                        <CloseIcon />
                    </IconButton>
                </div>
                <DialogContent>
                    <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
                        <iframe
                            src={movie.trailer}
                            title="Trailer"
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                            }}
                        ></iframe>
                    </div>
                </DialogContent>
            </Dialog>

            <div className="movie-detail-content">
                <div className="movie-detail-main-info">
                    <div className="movie-detail-image">
                        <img src={movie.img} alt={movie.name} />
                        <button className="btn-book-ticket" onClick={handleBookTicket}>Đặt Vé</button>
                    </div>
                    <div className="movie-detail-info">
                        <div className="movie-detail-name-wrapper">
                            <h2 className="movie-detail-name">{movie.name}</h2>
                        </div>
                        <div className="movie-detail-inf-wrapper">
                            <p><span className="label"> Thời lượng:</span> <span className="value">{movie.length} phút</span></p>
                            <div className="movie-meta-info">
                                <p><span className="label"> Thể loại: </span><span className="value">{movie.releaseDate || "Hành Động, Khoa Học Viễn Tưởng"}</span></p>
                                <p><span className="label"> Ngày khởi chiếu:</span> <span className="value">{movie.releaseDate || "Đang cập nhật"}</span></p>
                            </div>
                            <p><span className="label"> Giá vé:</span> <span className="value">{movie.price} $</span></p>
                            <p><span className="label"> Đạo diễn:</span> <span className="value">{movie.director || "Anthony Russo, Joe Russo"}</span></p>
                            <p><span className="label"> Diễn viên:</span> <span className="value">{movie.cast || "Robert Downey Jr, Chris Evans, Scarlett Johansson, Chris Hemsworth"}</span></p>
                        </div>
                    </div>
                </div>
                <div className="movie-detail-summary">
                    <div className="movie-detail-summary-title">
                        <h3>Tóm tắt</h3>
                    </div>
                    <p className="movie-detail-summary-text">{movie.description}</p>
                </div>
            </div>

            <div className="movie-detail-reviews">
                <div className="review-header-title">
                    <h3>Xếp hạng và đánh giá phim</h3>
                </div>
                <div className="review-input">
                    <div className="review-rating">
                        <label>Xếp hạng</label>
                        <div className="star-container">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    className={`star ${star <= (hover || rating) ? "filled" : ""}`}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHover(star)}
                                    onMouseLeave={() => setHover(0)}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                    </div>
                    <textarea className="review-textarea" placeholder="Nhập bình luận của bạn..."></textarea>
                    <button className="review-submit-btn">Bình luận</button>
                </div>
                <hr className="divider" />
                <div className="review-list">
                    {feedbackData.map((feedback) => (
                        <div key={feedback.id} className="review-item">
                            <div className="review-header">
                                <div className="review-info">
                                    <p className="review-role">{feedback.role}</p>
                                    <p className="review-stars">{feedback.stars} ★</p>
                                </div>
                                <p className="review-content">{feedback.content}</p>
                                <p className="review-date">{feedback.date}</p>
                            </div>
                            <div className="review-user">
                                <p className="review-username">{feedback.username}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <FloatingNavigation />
        </div>

    );
};

export default MovieDetail;
