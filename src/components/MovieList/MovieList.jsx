import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import FloatingNavigation from "../UtilityBar/FloatingNavigation";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./MovieList.css";

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [visibleCount, setVisibleCount] = useState(8);
  const [filter, setFilter] = useState("nowShowing");

  const fetchMovies = async (type) => {
    try {
      let response;
      if (type === "nowShowing") {
        response = await axios.get("http://localhost:8080/movie/nowcoming");
      } else {
        response = await axios.get("http://localhost:8080/movie/upcoming");
      }

      const movieList = response.data?.data || [];
      setAllMovies(movieList);
      setMovies(movieList.slice(0, visibleCount));
    } catch (error) {
      console.error("Lỗi khi tải danh sách phim:", error);
    }
  };

  useEffect(() => {
    fetchMovies(filter);
  }, [filter, visibleCount]);


  const handleShowMore = () => {
    if (visibleCount >= allMovies.length) {
      setVisibleCount(8);
      setMovies(allMovies.slice(0, 8));
    } else {
      setVisibleCount(visibleCount + 8);
      setMovies(allMovies.slice(0, visibleCount + 8));
    }
  };

  return (
    <div classNam="movie-list">
      <div className="hot_movies">
        <p className="title-unique">HOT MOVIES IN CINEMA</p>
        <Swiper
          className="swiper-container"
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={50}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000 }}
        >
          <SwiperSlide>
            <img
              src="https://media.lottecinemavn.com/Media/WebAdmin/ef4afc1938f04a669e8ec2e7b5578ad6.jpg"
              alt="Slide 1"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src="https://media.lottecinemavn.com/Media/WebAdmin/ee747d0d54bb445ba0d1f363f411ba9c.png"
              alt="Slide 2"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src="https://media.lottecinemavn.com/Media/WebAdmin/9e27c3018ad54fb39a1cdd27fdd828d6.jpg"
              alt="Slide 3"
            />
          </SwiperSlide>
        </Swiper>
      </div>

      <div className="filter-buttons">
        <button
          className={filter === "nowShowing" ? "active" : ""}
          onClick={() => setFilter("nowShowing")}
        >
          Now Showing
        </button>
        <button
          className={filter === "upcoming" ? "active" : ""}
          onClick={() => setFilter("upcoming")}
        >
          Coming Soon
        </button>
      </div>


      <div className="screen_cwrap">
        <div className="movie-list">
          {movies.map((movie) => (
            <div key={movie._id} className="movie-item">
              <div className="movie-image-container">
                <img
                  src={movie.img}
                  alt={movie.title}
                  className="movie-image"
                />
                <div className="overlay"> </div>
                <div className="movie-actions">
                  {new Date(movie.releaseDate) <= new Date() ? (

                    <button className="btn btn-detail">
                      <Link
                        to={`/bookingticket`}
                        state={{ selectedMovie: movie }}
                      >
                        <p>Book Ticket</p>
                      </Link>
                    </button>
                  ) : (
                      <button className="btn btn-disabled cursor-not-allowed" disabled>
                      <p>Not Yet Available</p>
                    </button>
                  )}
                  <button className="btn btn-book">
                    <Link to={`/movielist/${movie._id}`}>
                      <p>Details</p>
                    </Link>
                  </button>
                </div>
              </div>
              <div className="movie-info">
                <p className="movie-title">{movie.name}</p>
              </div>
              <div className="movie-details">
                <p className="movie-duration">{movie.length} minutes</p>
                <p className="movie-release-date">
                  {new Date(movie.releaseDate).toLocaleDateString("vi-VN")}
                </p>
              </div>
            </div>
          ))}
          {allMovies.length > 9 && (
            <button className="btn-add-close" onClick={handleShowMore}>
              {visibleCount < allMovies.length ? "More" : "Close"}
            </button>
          )}
        </div>
        <FloatingNavigation />
      </div>
    </div>
  );
};

export default MovieList;