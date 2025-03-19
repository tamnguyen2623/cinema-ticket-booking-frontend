import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { IconButton } from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import { getAvailableFeedbacks } from "../api/feedback";
import "./DetailMovie.css";
import FloatingNavigation from "../UtilityBar/FloatingNavigation";
import moment from "moment";

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openTrailer, setOpenTrailer] = useState(false);
  const [feedbackData, setFeedbackData] = useState([]);
  const navigate = useNavigate();

  const fetchMovie = async () => {
    try {
      await axios
        .get(`http://localhost:8080/movie/${id}`)
        .then((response) => {
          setMovie(response.data.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching movie:", error);
          setLoading(false);
        });
      const data = await getAvailableFeedbacks(id);
      setFeedbackData(data);
    } catch (error) {
      console.error("Failed to fetch detail movie:", error);
    }
  };

  useEffect(() => {
    fetchMovie();
  }, [id]);

  const handleBookTicket = () => {
    navigate("/bookingticket", { state: { selectedMovie: movie } });
  };

  if (loading) return <p>Loading...</p>;
  if (!movie) return <p>Movie not found</p>;

  return (
    <div className="movie-detail-container">
      <div className="movie-detail-header">
        <p className="movie-detail-title">PHIM HOT TẠI RẠP</p>
      </div>
      <div className="trailer-modal" onClick={() => setOpenTrailer(true)}>
        <div className="movie-trailer-container">
          <img
            src={movie.img}
            alt={movie.title}
            className="movie-image-trailer"
          />
          <PlayCircleOutlineIcon
            className="play-icon"
            sx={{ fontSize: "80px", cursor: "pointer" }}
          />
        </div>
      </div>

      <Dialog
        open={openTrailer}
        onClose={() => setOpenTrailer(false)}
        maxWidth="md"
        fullWidth
        className="custom-modal"
      >
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
          <div
            style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}
          >
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

      <div className="movie-detail-contentunique">
        <div className="movie-detail-main-info">
          <div className="movie-detail-image">
            <img src={movie.img} alt={movie.name} />
            <button className="btn-book-ticket" onClick={handleBookTicket}>
              Đặt Vé
            </button>
          </div>
          <div className="movie-detail-info">
            <div className="movie-detail-name-wrapper">
              <h2 className="movie-detail-name">{movie.name}</h2>
            </div>
            <div className="movie-detail-inf-wrapper">
              <p>
                <span className="label"> Thời lượng:</span>{" "}
                <span className="value">{movie.length} phút</span>
              </p>
              <div className="movie-meta-inforunique">
                <p>
                  <span className="label"> Thể loại: </span>
                  <span className="value">
                    {movie.movieType.name || "Hành Động, Khoa Học Viễn Tưởng"}
                  </span>
                </p>
                <p>
                  <span className="label"> Ngày khởi chiếu:</span>{" "}
                  <span className="value">
                  {new Date(movie.releaseDate).toLocaleDateString("vi-VN")}
                  </span>
                </p>
              </div>
              <p>
                <span className="label"> Đạo diễn:</span>{" "}
                <span className="value">{movie.director || "Jack 97"}</span>
              </p>
              <p>
                <span className="label"> Diễn viên:</span>{" "}
                <span className="value">
                  {movie.actor ||
                    "Robert Downey Jr, Chris Evans, Scarlett Johansson, Chris Hemsworth"}
                </span>
              </p>
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
        
        <hr className="divider" />
        <div className="review-list">
          {feedbackData.map((feedback) => (
            <div key={feedback._id} className="review-item">
              <div className="review-header">
                <div className="review-info">
                  <p className="review-role">Viewer</p>
                  <p className="review-stars">{feedback.ratting} ★</p>
                </div>
                <p className="review-content">{feedback.comment}</p>
                <p className="review-date">{moment(feedback.date).format("DD/MM/YYYY HH:mm")}</p>
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
