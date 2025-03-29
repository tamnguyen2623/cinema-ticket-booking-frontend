import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Button, Typography, Grid } from "@mui/material";
import { RightOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import axios from "axios";
import "./CinemaPage.css";
import TicketBoard from "../../pages/TicketBoard/TicketBoard";
const CinemaPage = () => {
  const { auth } = useContext(AuthContext);
  const [currentWeek, setCurrentWeek] = useState(0);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);

  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );
  const [movies, setMovies] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [movieShowing, setMovieShowing] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  dayjs.locale("vi");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [moviesRes, cinemasRes, movieShowingRes] = await Promise.all([
          axios.get("http://localhost:8080/movie/"),
          axios.get("http://localhost:8080/cinema/"),
          axios.get("http://localhost:8080/movieshowing/"),
        ]);
        setMovies(moviesRes.data.data || []);
        setCinemas(cinemasRes.data.data || []);
        setMovieShowing(movieShowingRes.data.data || []);
      } catch (err) {
        setError("Lỗi khi tải dữ liệu");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedDate || !selectedCinema) return;

    const fetchShowtimes = async () => {
      try {
        setShowtimes([]);
        let url = `http://localhost:8080/movieshowing/list?date=${selectedDate}&cinemaId=${selectedCinema._id}`;
        if (selectedMovie) {
          url += `&movieId=${selectedMovie._id}`;
        }
        console.log("Fetching API:", url);
        const response = await axios.get(url);
        setShowtimes(response.data.data || []);
      } catch (error) {
        console.error("Error fetching showtimes:", error);
      }
    };

    fetchShowtimes();
  }, [selectedDate, selectedCinema, selectedMovie]);

  useEffect(() => {
    if (location.state?.selectedMovie) {
      setSelectedMovie(location.state.selectedMovie);
    }
  }, [location.state]);

  // luu vao localstorage
  useEffect(() => {
    const bookingData = {
      selectedDate,
      selectedMovie,
      selectedCinema,
      selectedShowtime,
    };
    localStorage.setItem("bookingData", JSON.stringify(bookingData));
  }, [selectedDate, selectedMovie, selectedCinema, selectedShowtime]);

  const startOfWeek = dayjs()
    .add(currentWeek * 7, "day")
    .startOf("week");
  const weekDays = Array.from({ length: 7 }, (_, index) =>
    startOfWeek.add(index, "day")
  );
  const handleNextStep = () => {
    if (!selectedDate || !selectedCinema || !selectedMovie) {
      alert("Vui lòng chọn đầy đủ Ngày, Rạp và Phim trước khi tiếp tục!");
      return;
    }
    const firstShowtime = showtimes.find(
      (showtime) => showtime.movie._id === selectedMovie._id
    );
    if (!firstShowtime) {
      alert("Không có suất chiếu cho phim này!");
      return;
    }
    navigate(`/totalslide/${firstShowtime._id}`);
  };
  return (
    <div className="cinema-container">
      <div className="movie-detail-header">
        <p className="movie-detail-title">BOOK TICKET</p>
      </div>

      <div className="cinema-content">
        <div className="date-picker-container">
          <Button onClick={() => setCurrentWeek(currentWeek - 1)}>{"<"}</Button>

          <Grid container spacing={2} justifyContent="center">
            {weekDays.map((day, index) => (
              <Grid
                key={index}
                item
                xs={1.5}
                className={`date-item ${
                  selectedDate === day.format("YYYY-MM-DD") ? "active" : ""
                }`}
                onClick={() =>
                  setSelectedDate(
                    selectedDate === day.format("YYYY-MM-DD")
                      ? null
                      : day.format("YYYY-MM-DD")
                  )
                }
                style={{
                  position: "relative",
                  textAlign: "center",
                  cursor: "pointer",
                }}
              >
                <Typography variant="body1">{day.format("ddd")}</Typography>
                <Typography variant="h6">{day.format("DD")}</Typography>
                {selectedDate === day.format("YYYY-MM-DD") && (
                  <span
                    className="checkmark"
                    style={{
                      position: "absolute",
                      top: "3px",
                      right: "7px",
                      color: "black",
                      fontSize: "18px",
                      fontWeight: "bold",
                    }}
                  >
                    ✓
                  </span>
                )}
              </Grid>
            ))}
          </Grid>

          <Button onClick={() => setCurrentWeek(currentWeek + 1)}>{">"}</Button>
        </div>
        <div className="banner-secondary">
          <img
            src="https://dskb4mmeexzvj.cloudfront.net/cinema-shop/product-management/image/1440x548_d6b6b039ea.jpg"
            alt="Khuyến mãi rạp chiếu phim"
          />
        </div>
        <div className="ticket-option">
          <div className="show-cinema">
            <h3>Rạp</h3>
            <div className="cinema-list">
              {cinemas.map((cinema) => (
                <div
                  key={cinema._id}
                  className={`cinema-option ${
                    selectedCinema === cinema ? "active" : ""
                  }`}
                  onClick={() =>
                    setSelectedCinema(selectedCinema === cinema ? null : cinema)
                  }
                >
                  {selectedCinema === cinema && (
                    <span className="checkmark">✓</span>
                  )}
                  {cinema.name}
                </div>
              ))}
            </div>
          </div>

          <div className="show-movie">
            <h3>Phim</h3>
            <div className="moviedetail-list">
              {movies.map((movie) => (
                <div
                  key={movie._id}
                  className={`movie-option ${
                    selectedMovie === movie ? "active" : ""
                  }`}
                  onClick={() =>
                    setSelectedMovie(selectedMovie === movie ? null : movie)
                  }
                >
                  {selectedMovie === movie && (
                    <span className="checkmark">✓</span>
                  )}
                  {movie.name}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="Summary-booking">
          <div className="summary-item">
            <span className="summary-label">Ngày:</span> {selectedDate}
          </div>
          <div className="summary-item">
            <span className="summary-label">Phim:</span>{" "}
            {selectedMovie?.name || "Chưa chọn"}
          </div>
          <div className="summary-item">
            <span className="summary-label">Rạp:</span>{" "}
            {selectedCinema?.name || "Chưa chọn"}
          </div>
        </div>
        <div className="showtime-wait">
          <h3>
            Giờ chiếu{" "}
            <span className="text-display">
              Thời gian có thể chênh lệch 15 phút
            </span>
          </h3>
        </div>
        {selectedDate && selectedCinema ? (
          showtimes.length > 0 ? (
            <div className="movieshowtime-list">
              {selectedMovie ? (
                <div className="movieshowtime-item">
                  <h4
                    className="movieshowtime-title"
                    onClick={() => navigate(`/movie/${selectedMovie._id}`)}
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    {selectedMovie.name}
                    <RightOutlined
                      style={{
                        fontSize: 14,
                        backgroundColor: "white",
                        padding: "5px",
                        border: "1px solid black",
                      }}
                    />
                  </h4>

                  <dl className="showtime-list">
                    <dt className="nowzone">{selectedCinema.name}</dt>
                    <dd className="showtimes">
                      <ul className="showtime-ul">
                        {showtimes
                          .filter(
                            (showtime) =>
                              showtime.movie._id === selectedMovie._id
                          )
                          .map((showtime) => (
                            <li
                              key={showtime._id}
                              className={`showtime-item ${
                                selectedShowtime?._id === showtime._id
                                  ? "active"
                                  : ""
                              }`}
                              onClick={() => {
                                console.log("🟢 Selected Showtime:", showtime);
                                setSelectedShowtime(showtime);
                              }}
                            >
                              <Link
                                to={auth.token ? `/seatAvailable/${showtime._id}` : "/login"}
                                className="showtime-link"
                                style={{
                                  textDecoration: "none",
                                  color: "inherit",
                                }}
                              >
                                <p className="room-name">
                                  {showtime.room.roomname} -
                                  {showtime.room.roomtype}
                                </p>
                                <p className="showtime">
                                  {new Date(
                                    showtime.showtime.showtime
                                  ).toLocaleTimeString("vi-VN", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                              </Link>
                            </li>
                          ))}
                      </ul>
                    </dd>
                  </dl>
                </div>
              ) : (
                showtimes
                  .reduce((uniqueMovies, showtime) => {
                    const movie = showtime.movie;
                    if (!uniqueMovies.find((m) => m._id === movie._id)) {
                      uniqueMovies.push(movie);
                    }
                    return uniqueMovies;
                  }, [])
                  .map((movie) => (
                    <div key={movie._id} className="movieshowtime-item">
                      <h4
                        className="movieshowtime-title"
                        onClick={() => navigate(`/movie/${movie._id}`)}
                        style={{
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        {movie.name}
                        <RightOutlined
                          style={{
                            fontSize: 14,
                            backgroundColor: "white",
                            padding: "5px",
                            border: "1px solid black",
                          }}
                        />
                      </h4>

                      <dl className="showtime-list">
                        <dt className="nowzone">{selectedCinema.name}</dt>
                        <dd className="showtimes">
                          <ul className="showtime-ul">
                            {showtimes
                              .filter(
                                (showtime) => showtime.movie._id === movie._id
                              )
                              .map((showtime) => (
                                <li
                                  key={showtime._id}
                                  className={`showtime-item ${
                                    selectedShowtime?._id === showtime._id
                                      ? "active"
                                      : ""
                                  }`}
                                >
                                  <Link
                                    to={auth.token ? `/seatAvailable/${showtime._id}` : "/login"}
                                    className="showtime-link"
                                    style={{
                                      textDecoration: "none",
                                      color: "inherit",
                                    }}
                                  >
                                    <p className="room-name">
                                      {showtime.room.roomname}
                                    </p>
                                    <p className="showtime">
                                      {new Date(
                                        showtime.showtime.showtime
                                      ).toLocaleTimeString("vi-VN", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </p>
                                  </Link>
                                </li>
                              ))}
                          </ul>
                        </dd>
                      </dl>
                    </div>
                  ))
              )}
            </div>
          ) : (
            <p className="select-warning">Không có suất chiếu cho ngày này</p>
          )
        ) : (
          <p className="select-warning">
            Vui lòng chọn ngày và rạp để hiển thị suất chiếu
          </p>
        )}
      </div>
      <TicketBoard />
    </div>
  );
};

export default CinemaPage;
