import React, { useEffect, useState } from "react";
import { Button, Typography, Row, Col } from "antd";
import { RightOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import axios from "axios";
import "./CinemaPage.css";

const CinemaPage = () => {
  const [currentWeek, setCurrentWeek] = useState(0);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedCinema, setSelectedCinema] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format("YYYY-MM-DD")
  );
  const [movies, setMovies] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  dayjs.locale("vi");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [moviesRes, cinemasRes] = await Promise.all([
          axios.get("http://localhost:8080/movie/"),
          axios.get("http://localhost:8080/cinema/"),
        ]);
        setMovies(moviesRes.data.data || []);
        setCinemas(cinemasRes.data.data || []);
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

  const startOfWeek = dayjs()
    .add(currentWeek * 7, "day")
    .startOf("week");
  const weekDays = Array.from({ length: 7 }, (_, index) =>
    startOfWeek.add(index, "day")
  );

  return (
    <div className="cinema-container">
      <div className="movie-detail-header">
        <p className="movie-detail-title">MUA VÉ XEM PHIM</p>
      </div>

      <div className="cinema-content">
        <div className="date-picker-container">
          <Button onClick={() => setCurrentWeek(currentWeek - 1)}>{"<"}</Button>

          <Row gutter={[16, 16]} justify="center">
            {weekDays.map((day, index) => (
              <Col
                key={index}
                xs={4}
                sm={3}
                md={2}
                className={`date-item ${
                  selectedDate === day.format("YYYY-MM-DD") ? "active" : ""
                }`}
                onClick={() => setSelectedDate(day.format("YYYY-MM-DD"))}
                style={{ textAlign: "center", cursor: "pointer" }}
              >
                <Typography.Text>{day.format("ddd")}</Typography.Text>
                <Typography.Title level={5}>
                  {day.format("DD")}
                </Typography.Title>
              </Col>
            ))}
          </Row>

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
              {showtimes.map((showtime) => (
                <div key={showtime._id} className="movieshowtime-item">
                  <h4
                    className="movieshowtime-title"
                    onClick={() => navigate(`/movie/${showtime.movie._id}`)}
                    style={{
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    {showtime.movie.name}
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
                        <li className="showtime-item">
                          <Link
                            to={`/book-tickets/${showtime._id}`}
                            className="showtime-link"
                            style={{ textDecoration: "none", color: "inherit" }}
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
                      </ul>
                    </dd>
                  </dl>
                </div>
              ))}
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
    </div>
  );
};

export default CinemaPage;
