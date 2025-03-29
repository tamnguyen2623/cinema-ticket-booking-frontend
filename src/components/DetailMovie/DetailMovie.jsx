import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import { getAvailableFeedbacks } from "../api/feedback";
import "./DetailMovie.css";
import FloatingNavigation from "../UtilityBar/FloatingNavigation";
import moment from "moment";
import { FaHeart } from "react-icons/fa"; 
import { AuthContext } from "../../context/AuthContext";
import { Select } from "antd"; 
const { Option } = Select;

const MovieDetail = () => {
  const { id } = useParams();
  const { auth, setAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openTrailer, setOpenTrailer] = useState(false);
  const [feedbackData, setFeedbackData] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedRating, setSelectedRating] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/movie/${id}`);
        setMovie(response.data.data);
        setLoading(false);

        // ✅ Kiểm tra xem phim có trong danh sách yêu thích không
        setIsFavorite(auth.favoriteMovies?.includes(id));

        const data = await getAvailableFeedbacks(id);
        setFeedbackData(data);
      } catch (error) {
        console.error("Failed to fetch movie details:", error);
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id, auth.favoriteMovies]); 

  const handleBookTicket = () => {
    navigate("/bookingticket", { state: { selectedMovie: movie } });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleFavorite = async () => {
    try {
      const response = await axios.post(`http://localhost:8080/favorite/${id}`, {
        userId: auth.userId,
      });

      const updatedFavorites = response.data.favoriteMovies;
      setIsFavorite(updatedFavorites.includes(id));
      setAuth((prev) => ({ ...prev, favoriteMovies: updatedFavorites }));
    } catch (error) {
      console.error("Lỗi khi cập nhật danh sách yêu thích:", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!movie) return <p>Movie not found</p>;

  // Handle rating filter change
  const handleRatingFilter = (value) => {
    setSelectedRating(value);
  };

  // Filter feedback based on selected rating
  const filteredFeedback = selectedRating
    ? feedbackData.filter((feedback) => feedback.ratting === selectedRating)
    : feedbackData;

  return (
    <div className="movie-detail-container">
      <div className="movie-detail-header">
        <p className="movie-detail-title">HOT MOVIES IN CINEMA</p>
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
          <IconButton className="close-button" onClick={() => setOpenTrailer(false)} sx={{ color: "white" }}>
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
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
            ></iframe>
          </div>
        </DialogContent>
      </Dialog>

      <div className="movie-detail-contentunique">
        <div className="movie-detail-main-info">
          <div className="movie-detail-image">
            <img src={movie.img} alt={movie.name} />
            <button className="btn-book-ticket" onClick={handleBookTicket}>Đặt Vé</button>
          </div>
          <div className="movie-detail-info">
            <div className="movie-detail-name-wrapper">

              <h2 className="movie-detail-name">{movie.name}</h2>
              <FaHeart 
                style={{ fontSize: "24px", color: isFavorite ? "red" : "#ccc", cursor: "pointer" }}
                onClick={toggleFavorite}
                className="icon_heart"
              />
            </div>
            <div className="movie-detail-inf-wrapper">
              <p><span className="label"> Thời lượng:</span> <span className="value">{movie.length} phút</span></p>
              <div className="movie-meta-inforunique">
                <p><span className="label"> Thể loại: </span> <span className="value">{movie.movieType?.name || "Không rõ"}</span></p>
                <p><span className="label"> Ngày khởi chiếu:</span> <span className="value">{new Date(movie.releaseDate).toLocaleDateString("vi-VN")}</span></p>
              </div>
            </div>
          </div>
        </div>
        <div className="movie-detail-summary">
          <h3>Tóm tắt</h3>
          <p className="movie-detail-summary-text">{movie.description}</p>
        </div>
      </div>

      <div className="movie-detail-reviews">
        <hr className="divider" />
        <div className="filter-section">
          <label>Filter by Rating: </label>
          <Select
            defaultValue="All"
            style={{ width: 120 }}
            onChange={handleRatingFilter}
          >
            <Option value={null}>All</Option>
            <Option value={5}>5 ★</Option>
            <Option value={4}>4 ★</Option>
            <Option value={3}>3 ★</Option>
            <Option value={2}>2 ★</Option>
            <Option value={1}>1 ★</Option>
          </Select>
        </div>
        <div className="review-list">
          {filteredFeedback.length == 0 && (
            <p className="text-center text-base text-gray-600">
              - No feedback -
            </p>
          )}
          {filteredFeedback.map((feedback) => (
            <div key={feedback._id} className="review-item">
              <div className="review-header">
                <div className="review-info">
                  <p className="review-role">Viewer</p>
                  <p className="review-stars">{feedback.ratting} ★</p>
                </div>
                <p className="review-content">{feedback.comment}</p>
                <p className="review-date">
                  {moment(feedback.date).format("DD/MM/YYYY HH:mm")}
                </p>
              </div>
              <div className="review-user">
                <p className="review-username">{feedback.userId.fullname}</p>
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
