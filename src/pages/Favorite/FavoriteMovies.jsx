import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./FavoriteMovies.css";
import { AuthContext } from "../../context/AuthContext";

const FavoriteMovies = () => {
  const { auth } = useContext(AuthContext);
  const userId = auth.userId;

  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    if (!userId) {
      setError("Bạn cần đăng nhập để xem danh sách yêu thích.");
      setLoading(false);
      return;
    }

    const fetchFavoriteMovies = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/favorite/${userId}`);
        setFavoriteMovies(response.data.favoriteMovies);
      } catch (err) {
        setError("Không thể tải danh sách phim yêu thích.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteMovies();
  }, [userId]);

  const handleShowMore = () => {
    setVisibleCount((prevCount) => (prevCount < favoriteMovies.length ? favoriteMovies.length : 6));
  };

  return (
    <div className="favorite-movies-container">
      <div className="movie-detail-header">
        <p className="movie-detail-title">FAVORITE MOVIE LIST</p>
      </div>
      <div className="screen_cwrap">
        {loading ? (
          <p>Đang tải...</p>
        ) : error ? (
          <p>{error}</p>
        ) : favoriteMovies.length === 0 ? (
          <span className="text-display">Không có phim nào trong danh sách yêu thích.</span>
        ) : (
          <div className="favoritemovie-list">
            {favoriteMovies.slice(0, visibleCount).map((movie) => (
                <div key={movie._id} className="movie-item">
                  <div className="movie-image-container">
                  <img
                    src={movie.img}
                    alt={movie.title}
                    className="movie-image"
                  />
                  <div className="movie-actions">
                    <button className="btn btn-book">
                      <Link to={`/movielist/${movie._id}`}>
                        <p>Details</p>
                      </Link>
                    </button>
                  </div>
                </div>
                <h3 className="movie-title">{movie.name}</h3>
              </div>
            ))}
          </div>
        )}
        {favoriteMovies.length > 6 && (
          <button className="btn-add-close" onClick={handleShowMore}>
            {visibleCount < favoriteMovies.length ? "More" : "Close"}
          </button>
        )}
      </div>
    </div>
  );
};

export default FavoriteMovies;
