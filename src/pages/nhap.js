import React, { useState, useEffect, useContext } from "react";
import {
  Card,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Table,
  notification,
  DatePicker,
} from "antd";
import {
  PlusOutlined,
  CreditCardOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import moment from "moment";
import "../components/styles/bookingStyle.css";
import { AuthContext } from "../context/AuthContext";
import { getAllCinema, getMovieShowing } from "../components/api/bookingApi";

const { Option } = Select;
const ticketPrices = {
  normal: 50000,
  vip: 80000,
};

const vipSeats = ["A1", "A2", "A3", "A4", "A5", "B1", "B2", "B3", "B4", "B5"];
const seats = [
  ...Array.from({ length: 10 }, (_, i) => `A${i + 1}`),
  ...Array.from({ length: 10 }, (_, i) => `B${i + 1}`),
  ...Array.from({ length: 10 }, (_, i) => `C${i + 1}`),
];

const Booking = () => {
  const { auth } = useContext(AuthContext);
  const [movieshowing, setMovieShowing] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [selectedMovieName, setSelectedMovieName] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [selectedShowTime, setselectedShowTime] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [tickets, setTickets] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [editingTicket, setEditingTicket] = useState(null);
  const [hasUnpaidTicket, setHasUnpaidTicket] = useState(false);

  useEffect(() => {
    const fetchMovieShowing = async () => {
      try {
        const fetchedMovieShowing = await getMovieShowing();
        console.log("object movieshowing", fetchedMovieShowing);
        setMovieShowing(fetchedMovieShowing);
      } catch (error) {
        notification.error({
          message: "Error",
          description: error.message,
          duration: 2,
        });
      }
    };
    fetchMovieShowing();
  }, []);

  useEffect(() => {
    const fetchAllCinema = async () => {
      try {
        const fetchedallcinema = await getAllCinema();
        console.log("object cinema", fetchedallcinema);
        setCinemas(fetchedallcinema);
      } catch (error) {
        notification.error({
          message: "Error",
          description: error.message,
          duration: 2,
        });
      }
    };
    fetchAllCinema();
  }, []);

  const openBookingModal = (movie) => {
    console.log("Movie ID:", movie?.movieId?._id);
    const movieId = movie?.movieId?._id;
    setSelectedMovieName(movie?.movieId?.name || "");
  
    // Lọc danh sách các suất chiếu theo movieId đã chọn
    const showingCinema = movieshowing.filter(
      (show) => show.movieId?._id === movieId
    );
  
    if (showingCinema.length > 0) {
      const formattedShowTimes = []; // Mảng chứa giờ chiếu hợp lệ
  
      // **Lấy danh sách rạp, loại bỏ trùng lặp**
      let showingCinemas = movieshowing
        .filter((show) => show.movieId?._id === movieId)
        .map((show) => show.roomId.cinema.name.trim()); // Xóa khoảng trắng thừa
  
      // **Sử dụng Set để loại bỏ trùng lặp theo tên rạp**
      const uniqueCinemas = Array.from(new Set(showingCinemas));
  
      setCinemas(uniqueCinemas);
      console.log("Danh sách rạp sau khi loại bỏ trùng lặp:", uniqueCinemas);
  
      // **Gộp thông tin suất chiếu theo từng rạp**
      const showInfoMap = new Map();
  
      showingCinema.forEach((show) => {
        const cinemaName = show.roomId?.cinema?.name || "N/A";
        const roomName = show.roomId?.roomtype || "N/A";
        const showDates = show.showDate || [];
        const showTimes = show.showtimeId?.showtime || [];
  
        if (!showInfoMap.has(cinemaName)) {
          showInfoMap.set(cinemaName, {
            movieName: show.movieId?.name || "N/A",
            cinemaName,
            roomName,
            showDates: new Set(),
            showTimes: new Set(),
          });
        }
  
        // Thêm ngày chiếu và giờ chiếu vào Set để loại bỏ trùng lặp
        showDates.forEach((date) => showInfoMap.get(cinemaName).showDates.add(date));
        showTimes.forEach((time) => {
          const validShowTime = new Date(time);
          if (!isNaN(validShowTime.getTime())) {
            const showTimeFormatted = validShowTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
            showInfoMap.get(cinemaName).showTimes.add(showTimeFormatted);
          }
        });
      });
  
      // Chuyển đổi Set thành mảng để sử dụng
      const showInfo = Array.from(showInfoMap.values()).map((info) => ({
        ...info,
        showDates: Array.from(info.showDates),
        showTimes: Array.from(info.showTimes),
      }));
  
      setSelectedMovie(showInfo);
  
      showInfo.forEach((show) => {
        console.log(`Phim "${show.movieName}" đang chiếu tại rạp: ${show.cinemaName}`);
        console.log(`Phòng chiếu: ${show.roomName}`);
        show.showDates.forEach((showDate) => console.log(`Ngày chiếu: ${showDate}`));
        show.showTimes.forEach((showtime) => console.log(`Giờ chiếu: ${showtime}`));
      });
  
      setselectedShowTime(showInfo.flatMap((s) => s.showTimes));
    }
  
    setIsBookingModalOpen(true);
  };
  

  useEffect(() => {
    if (!isBookingModalOpen) {
      setSelectedMovieName(""); // Xóa tên phim
      setSelectedMovie([]); // Xóa thông tin chiếu
      setSelectedSeats([]); // Xóa ghế đã chọn
      form.resetFields(); // Đặt lại giá trị form
    }
  }, [isBookingModalOpen]);

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
    form.resetFields();
    setSelectedSeats([]);
  };

  const handleSeatSelection = (seat) => {
    setSelectedSeats((prevSeats) =>
      prevSeats.includes(seat)
        ? prevSeats.filter((s) => s !== seat)
        : [...prevSeats, seat]
    );
  };

  const totalPrice = selectedSeats.reduce(
    (total, seat) =>
      total +
      (vipSeats.includes(seat) ? ticketPrices.vip : ticketPrices.normal),
    0
  );

  const handleBooking = (values) => {
    if (hasUnpaidTicket) {
      notification.warning({
        message: "Bạn cần thanh toán vé trước khi đặt vé mới!",
      });
      return;
    }

    const totalPrice = selectedSeats.reduce(
      (total, seat) =>
        total +
        (vipSeats.includes(seat) ? ticketPrices.vip : ticketPrices.normal),
      0
    );

    const newTicket = {
      key: tickets.length + 1,
      movie: selectedMovie.title,
      date: values.date.format("DD/MM/YYYY"),
      cinema: values.cinema,
      room: values.room,
      showtime: values.showtime,
      seat: selectedSeats.join(", "),
      total: totalPrice.toLocaleString() + " VND",
      status: "Chưa Thanh Toán",
    };

    setTickets([...tickets, newTicket]);
    setHasUnpaidTicket(true); // Đánh dấu có vé chưa thanh toán
    setIsBookingModalOpen(false);
  };

  const handlePayment = (ticketKey) => {
    const updatedTickets = tickets.map((ticket) =>
      ticket.key === ticketKey ? { ...ticket, status: "Đã Thanh Toán" } : ticket
    );
    setTickets(updatedTickets);

    // Kiểm tra nếu không còn vé nào chưa thanh toán thì mở lại đặt vé
    const stillHasUnpaid = updatedTickets.some(
      (ticket) => ticket.status === "Chưa Thanh Toán"
    );
    setHasUnpaidTicket(stillHasUnpaid);

    notification.success({
      message: "Thanh toán thành công!",
    });
  };

  const handleEditTicket = (ticket) => {
    setEditingTicket(ticket);
    setIsBookingModalOpen(true);
    form.setFieldsValue({
      cinema: ticket.cinema,
      room: ticket.room,
      date: moment(ticket.date, "DD/MM/YYYY"),
      showtime: ticket.showtime,
    });
    setSelectedSeats(ticket.seat.split(", "));
  };
  const handleDeleteTicket = (ticketKey) => {
    const updatedTickets = tickets.filter((ticket) => ticket.key !== ticketKey);
    setTickets(updatedTickets);

    // Check if there are any unpaid tickets left
    const stillHasUnpaid = updatedTickets.some(
      (ticket) => ticket.status === "Chưa Thanh Toán"
    );
    setHasUnpaidTicket(stillHasUnpaid);

    notification.success({
      message: "Xóa vé thành công!",
    });
  };

  const columns = [
    { title: "Phim", dataIndex: "movie", key: "movie" },
    { title: "Ngày", dataIndex: "date", key: "date" },
    { title: "Rạp", dataIndex: "cinema", key: "cinema" },
    { title: "Phòng", dataIndex: "room", key: "room" },
    { title: "Giờ", dataIndex: "showtime", key: "showtime" },
    { title: "Ghế", dataIndex: "seat", key: "seat" },
    { title: "Giá vé", dataIndex: "total", key: "total" },
    { title: "Trạng Thái", dataIndex: "status", key: "status" },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) =>
        record.status === "Chưa Thanh Toán" ? (
          <>
            <Button
              type="primary"
              icon={<CreditCardOutlined />}
              onClick={() => handlePayment(record.key)}
              style={{ marginRight: 5 }}
            >
              Thanh Toán
            </Button>
            <Button
              type="default"
              icon={<EditOutlined />}
              onClick={() => handleEditTicket(record)}
              style={{ marginRight: 5 }}
            >
              Cập Nhật Thông Tin
            </Button>
            <Button
              type="danger"
              onClick={() => handleDeleteTicket(record.key)}
            >
              Xóa
            </Button>
          </>
        ) : (
          <span>✔ Đã Thanh Toán</span>
        ),
    },
  ];

  return (
    <div className="booking-container">
      <div>
        <h2>Danh sách Rạp Chiếu Phim</h2>
        {cinemas.length > 0 ? (
          <ul>
            {cinemas.map((cinema) => (
              <li key={cinema.id}>
                <h3>{cinema.name}</h3>
                <p>Địa chỉ: {cinema.address}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>Không có rạp nào chiếu phim này.</p>
        )}
      </div>
      <div className="movies-section">
        <h2>🎬 Phim Đang Chiếu</h2>
        <div className="movie-list">
          {movieshowing.map((movie) => (
            <Card
              key={movie.id}
              hoverable
              cover={<img alt={movie.title} src={movie.movieId.img} />}
              className="movie-card"
            >
              <Card.Meta title={movie.movieId.name} />
              <Button
                type="primary"
                onClick={() => openBookingModal(movie)}
                className="book-button"
                disabled={hasUnpaidTicket}
              >
                <PlusOutlined /> Đặt Vé
              </Button>
            </Card>
          ))}
        </div>
      </div>

      <div className="ticket-section">
        <h2>🎟️ Vé Đã Đặt</h2>
        <Table
          columns={columns}
          dataSource={tickets}
          pagination={{ pageSize: 5 }}
        />
      </div>
      {isBookingModalOpen && (
        <Modal
          title={editingTicket ? "Cập Nhật Thông Tin Vé" : "Đặt Vé Xem Phim"}
          open={isBookingModalOpen}
          onCancel={closeBookingModal}
          footer={[
            <Button key="cancel" onClick={closeBookingModal}>
              Hủy
            </Button>,
            <Button key="submit" type="primary" onClick={() => form.submit()}>
              {editingTicket ? "Cập Nhật" : "Xác Nhận"}
            </Button>,
          ]}
        >
          {selectedMovie && (
            <Form form={form} layout="vertical" onFinish={handleBooking}>
              <Form.Item
                label="Phim"
                name="movie"
                initialValue={selectedMovieName || "Default Movie Title"}
              >
                <Input disabled />
              </Form.Item>

              <Form.Item
                label="Chọn Rạp"
                name="cinema"
                rules={[{ required: true }]}
              >
                <Select>
                  {selectedMovie.map((show, index) => (
                    <Option key={index} value={show.cinemaName}>
                      {show.cinemaName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Chọn Phòng"
                name="room"
                rules={[{ required: true }]}
              >
                <Select>
                  {selectedMovie.map((show, index) => (
                    <Option key={index} value={show.roomName}>
                      {show.roomName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Chọn Ngày"
                name="date"
                rules={[{ required: true }]}
              >
                <Select>
                  {selectedMovie.map((show, index) =>
                    show.showDates.map((date, dateIndex) => (
                      <Option key={dateIndex} value={date}>
                        {date}
                      </Option>
                    ))
                  )}
                </Select>
              </Form.Item>

              <Form.Item
                label="Chọn Giờ"
                name="showtime"
                rules={[{ required: true }]}
              >
                <Select>
                  {Array.isArray(selectedShowTime) &&
                    selectedShowTime.map((show, index) => (
                      <Option key={index} value={show.showtime}>
                        {show.showtime}
                      </Option>
                    ))}
                </Select>
              </Form.Item>

              <Form.Item label="Chọn Ghế">
                <div className="seat-selection">
                  {seats.map((seat) => (
                    <Button
                      key={seat}
                      type={
                        selectedSeats.includes(seat) ? "primary" : "default"
                      }
                      onClick={() => handleSeatSelection(seat)}
                      className={`seat-button ${
                        vipSeats.includes(seat) ? "vip-seat" : "normal-seat"
                      } ${selectedSeats.includes(seat) ? "selected-seat" : ""}`}
                    >
                      {seat}
                    </Button>
                  ))}
                </div>
              </Form.Item>
            </Form>
          )}
        </Modal>
      )}
    </div>
  );
};

export default Booking;

// import React, { useState, useEffect } from "react";
// import { Card, Button, Modal, Form, Input, Select, notification } from "antd";
// import { PlusOutlined } from "@ant-design/icons";
// import "../components/styles/bookingStyle.css";
// import {
//   getAllCinema,
//   getMovieShowing,
//   getMovieShowings,
// } from "../components/api/bookingApi";
// import axios from "axios"; // 🛠 Thêm dòng này vào đầu file

// const { Option } = Select;

// const Booking = () => {
//   const [movieshowing, setMovieShowing] = useState([]);
//   const [cinemas, setCinemas] = useState([]);
//   const [selectedMovieName, setSelectedMovieName] = useState("");
//   const [selectedMovie, setSelectedMovie] = useState(null);
//   const [selectedShowDates, setSelectedShowDates] = useState(null);
//   const [selectedShowTime, setselectedShowTime] = useState(null);
//   const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
//   const [form] = Form.useForm();

//   useEffect(() => {
//     const fetchMovieShowing = async () => {
//       try {
//         const fetchedMovieShowing = await getMovieShowing();
//         setMovieShowing(fetchedMovieShowing);
//       } catch (error) {
//         notification.error({
//           message: "Error",
//           description: error.message,
//           duration: 2,
//         });
//       }
//     };
//     fetchMovieShowing();
//   }, []);

//   useEffect(() => {
//     const fetchAllCinema = async () => {
//       try {
//         const fetchedallcinema = await getAllCinema();
//         setCinemas(fetchedallcinema);
//       } catch (error) {
//         notification.error({
//           message: "Error",
//           description: error.message,
//           duration: 2,
//         });
//       }
//     };
//     fetchAllCinema();
//   }, []);

//   // const openBookingModal = (movie) => {
//   //   const movieId = movie?.movieId?._id;
//   //   setSelectedMovieName(movie?.movieId?.name || "");

//   //   // Lọc tất cả suất chiếu của bộ phim được chọn
//   //   const showingCinema = movieshowing.filter(
//   //     (show) => show.movieId?._id === movieId
//   //   );

//   //   if (showingCinema.length > 0) {
//   //     // Dùng Set để loại bỏ trùng lặp dựa trên name + address
//   //     const uniqueCinemas = [];
//   //     const cinemaSet = new Set();

//   //     showingCinema.forEach((show) => {
//   //       const cinema = show.roomId?.cinema;
//   //       if (!cinema) return;

//   //       const cinemaName = cinema?.name || "N/A";
//   //       const cinemaAddress = cinema?.address || "Chưa có địa chỉ";
//   //       const key = `${cinemaName}-${cinemaAddress}`;

//   //       if (!cinemaSet.has(key)) {
//   //         cinemaSet.add(key);
//   //         uniqueCinemas.push({ name: cinemaName, address: cinemaAddress });
//   //       }
//   //     });

//   //     console.log("Danh sách rạp:", uniqueCinemas);
//   //     setCinemas(uniqueCinemas);

//   //     // Tạo danh sách suất chiếu theo từng rạp
//   //     const showInfoMap = new Map();

//   //     showingCinema.forEach((show) => {
//   //       const cinemaName = show.roomId?.cinema?.name || "N/A";
//   //       const cinemaAddress = show.roomId?.cinema?.address || "Chưa có địa chỉ";
//   //       const roomName = show.roomId?.roomtype || "N/A";
//   //       const showDates = Array.isArray(show.showDate) ? show.showDate : [];
//   //       const showTimes = Array.isArray(show.showtimeId?.showtime)
//   //         ? show.showtimeId.showtime
//   //         : [];

//   //       const key = `${cinemaName}-${cinemaAddress}`;

//   //       if (!showInfoMap.has(key)) {
//   //         showInfoMap.set(key, {
//   //           movieName: show.movieId?.name || "N/A",
//   //           cinemaName,
//   //           address: cinemaAddress,
//   //           roomName,
//   //           showDates: new Set(),
//   //           showTimes: new Set(),
//   //         });
//   //       }

//   //       showDates.forEach((date) => {
//   //         if (!isNaN(new Date(date).getTime())) {
//   //           showInfoMap.get(key).showDates.add(date);
//   //         }
//   //       });

//   //       showTimes.forEach((time) => {
//   //         const validShowTime = new Date(time);
//   //         if (!isNaN(validShowTime.getTime())) {
//   //           const showTimeFormatted = validShowTime.toLocaleTimeString([], {
//   //             hour: "2-digit",
//   //             minute: "2-digit",
//   //           });
//   //           showInfoMap.get(key).showTimes.add(showTimeFormatted);
//   //         }
//   //       });
//   //     });

//   //     // Convert Map thành array và sắp xếp ngày chiếu theo thứ tự
//   //     const showInfo = Array.from(showInfoMap.values()).map((info) => ({
//   //       ...info,
//   //       showDates: Array.from(info.showDates).sort(
//   //         (a, b) => new Date(a) - new Date(b)
//   //       ),
//   //       showTimes: Array.from(info.showTimes),
//   //     }));

//   //     console.log("Danh sách suất chiếu:", showInfo);
//   //     setSelectedMovie(showInfo);
//   //   }

//   //   setIsBookingModalOpen(true);
//   // };

//   // const openBookingModal = async (movie) => {
//   //   try {
//   //     const movieId = movie?.movieId?._id;
//   //     setSelectedMovieName(movie?.movieId?.name || "");

//   //     const response = await axios.get(
//   //       `/movieshowing/movieshowings/${movieId}`
//   //     );
//   //     const { cinemas } = response.data;

//   //     if (cinemas.length > 0) {
//   //       setCinemas(
//   //         cinemas.map(({ cinemaName, address }) => ({
//   //           name: cinemaName,
//   //           address,
//   //         }))
//   //       );
//   //       setSelectedMovie(cinemas);
//   //     }

//   //     setIsBookingModalOpen(true);
//   //   } catch (error) {
//   //     console.error("Lỗi khi lấy suất chiếu:", error);
//   //   }
//   // };
//   const openBookingModal = async (movie) => {
//     try {
//       const movieId = movie?.movieId?._id;
//       setSelectedMovieName(movie?.movieId?.name || "");

//       // 🛠 Gọi API getMovieShowing
//       const response = await getMovieShowings(movieId);
//       console.log("API response:", response); // Kiểm tra dữ liệu trả về

//       // Kiểm tra nếu response không hợp lệ
//       if (!response || !response.cinemas) {
//         throw new Error("Không có dữ liệu suất chiếu");
//       }

//       const { cinemas } = response;

//       if (cinemas.length > 0) {
//         setCinemas(
//           cinemas.map(({ cinemaName, address }) => ({
//             name: cinemaName,
//             address,
//           }))
//         );
//         setSelectedMovie(cinemas);
//       }

//       setIsBookingModalOpen(true);
//     } catch (error) {
//       console.error("Lỗi khi lấy suất chiếu:", error);
//     }
//   };

//   // const handleSelectCinema = (cinemaName, cinemaAddress) => {
//   //   if (!selectedMovie || selectedMovie.length === 0) {
//   //     console.log("Danh sách phim trống hoặc chưa được tải.");
//   //     setSelectedShowDates([]);
//   //     setselectedShowTime([]);
//   //     return;
//   //   }

//   //   console.log("Danh sách rạp trong selectedMovie:", selectedMovie);
//   //   console.log("Tên rạp được chọn:", cinemaName);
//   //   console.log("Địa chỉ rạp được chọn:", cinemaAddress);

//   //   // Kiểm tra cách so sánh chuỗi
//   //   const selectedCinema = selectedMovie.find(
//   //     (cinema) =>
//   //       cinema.cinemaName.toLowerCase().includes(cinemaName.toLowerCase()) &&
//   //       cinema.address.toLowerCase().includes(cinemaAddress.toLowerCase())
//   //   );

//   //   if (selectedCinema) {
//   //     console.log("🎬 Rạp đã chọn có suất chiếu:", selectedCinema);
//   //     setSelectedShowDates(selectedCinema.showDates || []);
//   //     setselectedShowTime(selectedCinema.showTimes || []);
//   //   } else {
//   //     console.log("⚠️ Không tìm thấy suất chiếu cho rạp đã chọn.");
//   //     setSelectedShowDates([]);
//   //     setselectedShowTime([]);
//   //   }
//   // };

//   // const handleSelectDate = (date) => {
//   //   console.log("🟢 Ngày được chọn:", date);

//   //   const selectedCinema = selectedMovie.find((cinema) =>
//   //     cinema.showDates.includes(date)
//   //   );

//   //   if (selectedCinema) {
//   //     const filteredShowTimes = movieshowing
//   //       .filter(
//   //         (show) =>
//   //           show.roomId?.cinema?.name === selectedCinema.cinemaName &&
//   //           show.roomId?.cinema?.address === selectedCinema.address
//   //       )
//   //       .flatMap((show) =>
//   //         Array.isArray(show.showtimeId?.showtime)
//   //           ? show.showtimeId.showtime
//   //               .filter((time) => {
//   //                 const showtimeObj = new Date(time);
//   //                 const showtimeDate = showtimeObj.toISOString().split("T")[0]; // YYYY-MM-DD

//   //                 console.log("🔹 Ngày suất chiếu gốc:", time);
//   //                 console.log("🔹 Ngày suất chiếu đã xử lý:", showtimeDate);

//   //                 return showtimeDate === date;
//   //               })
//   //               .map((time) =>
//   //                 new Date(time).toLocaleTimeString([], {
//   //                   hour: "2-digit",
//   //                   minute: "2-digit",
//   //                 })
//   //               )
//   //           : []
//   //       );

//   //     console.log("🎬 Giờ chiếu lọc được:", filteredShowTimes);
//   //     setselectedShowTime(filteredShowTimes);
//   //   } else {
//   //     console.log("⚠️ Không tìm thấy suất chiếu cho ngày đã chọn.");
//   //     setselectedShowTime([]);
//   //   }
//   // };

//   const handleSelectCinema = (cinemaName, cinemaAddress) => {
//     const selectedCinema = selectedMovie.find(
//       (cinema) =>
//         cinema.cinemaName.toLowerCase() === cinemaName.toLowerCase() &&
//         cinema.address.toLowerCase() === cinemaAddress.toLowerCase()
//     );

//     if (selectedCinema) {
//       setSelectedShowDates(selectedCinema.showDates || []);
//       setselectedShowTime(selectedCinema.showTimes || []);
//     } else {
//       setSelectedShowDates([]);
//       setselectedShowTime([]);
//     }
//   };

//   const handleSelectDate = (date) => {
//     const selectedCinema = selectedMovie.find((cinema) =>
//       cinema.showDates.includes(date)
//     );

//     if (selectedCinema) {
//       setselectedShowTime(selectedCinema.showTimes || []);
//     } else {
//       setselectedShowTime([]);
//     }
//   };

//   useEffect(() => {
//     if (!isBookingModalOpen) {
//       setSelectedMovieName("");
//       setSelectedMovie([]);
//       form.resetFields();
//     }
//   }, [isBookingModalOpen]);

//   const closeBookingModal = () => {
//     setIsBookingModalOpen(false);
//     form.resetFields();
//   };

//   return (
//     <div className="booking-container">
//       <div>
//         <h2>Danh sách Rạp Chiếu Phim</h2>
//         {cinemas.length > 0 ? (
//           <ul>
//             {cinemas.map((cinema) => (
//               <li key={cinema.id}>
//                 <h3>{cinema.name}</h3>
//                 <p>Địa chỉ: {cinema.address}</p>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <p>Không có rạp nào chiếu phim này.</p>
//         )}
//       </div>
//       <div className="movies-section">
//         <h2>🎬 Phim Đang Chiếu</h2>
//         <div className="movie-list">
//           {movieshowing.map((movie) => (
//             <Card
//               key={movie.id}
//               hoverable
//               cover={<img alt={movie.title} src={movie.movieId.img} />}
//               className="movie-card"
//             >
//               <Card.Meta title={movie.movieId.name} />
//               <Button
//                 type="primary"
//                 onClick={() => openBookingModal(movie)}
//                 className="book-button"
//               >
//                 <PlusOutlined /> Đặt Vé
//               </Button>
//             </Card>
//           ))}
//         </div>
//       </div>

//       {isBookingModalOpen && (
//         <Modal
//           title="Đặt Vé Xem Phim"
//           open={isBookingModalOpen}
//           onCancel={closeBookingModal}
//           footer={[
//             <Button key="cancel" onClick={closeBookingModal}>
//               Hủy
//             </Button>,
//             <Button key="submit" type="primary" onClick={() => form.submit()}>
//               Xác Nhận
//             </Button>,
//           ]}
//         >
//           {selectedMovie && (
//             <Form form={form} layout="vertical">
//               <Form.Item
//                 label="Phim"
//                 name="movie"
//                 initialValue={selectedMovieName}
//               >
//                 <Input disabled />
//               </Form.Item>

//               <Form.Item
//                 label="Chọn Rạp"
//                 name="cinema"
//                 rules={[{ required: true, message: "Vui lòng chọn rạp" }]}
//               >
//                 <Select
//                   onChange={(value) => {
//                     const [cinemaName, cinemaAddress] = value.split("||");
//                     console.log("Rạp đã chọn:", cinemaName);
//                     console.log("Địa chỉ rạp đã chọn:", cinemaAddress);
//                     handleSelectCinema(cinemaName, cinemaAddress);
//                   }}
//                 >
//                   {selectedMovie.map((show, index) => (
//                     <Option
//                       key={index}
//                       value={`${show.cinemaName}||${show.address}`}
//                     >
//                       {show.cinemaName} - {show.address || "Chưa có địa chỉ"}
//                     </Option>
//                   ))}
//                 </Select>
//               </Form.Item>

//               <Form.Item
//                 label="Chọn Ngày"
//                 name="date"
//                 rules={[{ required: true }]}
//               >
//                 <Select onChange={handleSelectDate}>
//                   {selectedShowDates?.map((date, index) => (
//                     <Option key={index} value={date}>
//                       {date}
//                     </Option>
//                   ))}
//                 </Select>
//               </Form.Item>

//               <Form.Item
//                 label="Chọn Giờ"
//                 name="showtime"
//                 rules={[{ required: true }]}
//               >
//                 <Select>
//                   {Array.isArray(selectedShowTime) &&
//                     selectedShowTime.map((time, index) => (
//                       <Option key={index} value={time}>
//                         {time}
//                       </Option>
//                     ))}
//                 </Select>
//               </Form.Item>

//               <Form.Item
//                 label="Chọn Phòng"
//                 name="room"
//                 rules={[{ required: true }]}
//               >
//                 <Select>
//                   {selectedMovie.map((show, index) => (
//                     <Option key={index} value={show.roomName}>
//                       {show.roomName}
//                     </Option>
//                   ))}
//                 </Select>
//               </Form.Item>
//             </Form>
//           )}
//         </Modal>
//       )}
//     </div>
//   );
// };

// export default Booking;

