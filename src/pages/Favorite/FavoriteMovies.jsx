import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./FavoriteMovies.css";
import { AuthContext } from "../../context/AuthContext";

const FavoriteMovies = () => {
  const { auth } = useContext(AuthContext);
  const userId = auth.userId; // Không cần kiểm tra vì đã đảm bảo đăng nhập

  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    const fetchFavoriteMovies = async () => {
      try {
        setError(null); // Reset lỗi trước khi fetch mới
        const response = await axios.get(`http://localhost:8080/favorite/${userId}`);
        setFavoriteMovies(response.data.favoriteMovies);
      } catch (err) {
        setError("Unable to load favorite movie list.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteMovies();
  }, [userId]);

  const handleShowMore = () => {
    setVisibleCount(visibleCount < favoriteMovies.length ? favoriteMovies.length : 6);
  };

  return (
    <div className="favorite-movies-container">
      <div className="movie-detail-header">
        <p className="movie-detail-title">FAVORITE MOVIE LIST</p>
      </div>
      <div className="screen_cwrap">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : favoriteMovies.length === 0 ? (
          <span className="select-warning">There are no movies in the favorites list.</span>
        ) : (
          <div className="favoritemovie-list">
            {favoriteMovies.slice(0, visibleCount).map((movie) => (
              <div key={movie._id} className="movie-item">
                <div className="movie-image-container">
                  <img src={movie.img} alt={movie.title} className="movie-image" />
                  <div className="movie-actions">
                    <Link to={`/movielist/${movie._id}`} className="btn btn-book">
                      <p>Details</p>
                    </Link>
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