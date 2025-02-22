// import React, { useState, useEffect } from "react";
// import { Card, Button, Modal, Form, Input, Select, notification } from "antd";
// import { PlusOutlined } from "@ant-design/icons";
// import "../components/styles/bookingStyle.css";
// import {
//   getAllCinema,
//   getMovieShowing,
//   getMovieShowings,
//   getAllRoom,
// } from "../components/api/bookingApi";
// import TotalSlide from "./TotalSlide";
// const { Option } = Select;

// const Booking = () => {
//   const [movieshowing, setMovieShowing] = useState([]);
//   const [cinemas, setCinemas] = useState([]);
//   const [selectedMovieName, setSelectedMovieName] = useState("");
//   const [selectedMovie, setSelectedMovie] = useState(null);
//   const [selectedRoom, setSelectedRoom] = useState([]); // Danh sách phòng chiếu
//   const [selectedShowDates, setSelectedShowDates] = useState(null);
//   const [selectedShowTime, setselectedShowTime] = useState(null);
//   const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
//   const [form] = Form.useForm();
//   const [filterRoom, setFilterRoom] = useState([]);
//   const [selectedSeats, setSelectedSeats] = useState([]);
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
//         console.log("first fetched", fetchedallcinema);
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

//   useEffect(() => {
//     const fetchAllRoom = async () => {
//       try {
//         const fetchedallroom = await getAllRoom(); // Giả sử bạn gọi API lấy thông tin phòng
//         console.log("room", fetchedallroom.rooms); // Kiểm tra xem rooms có trả về không

//         // Duyệt qua tất cả các phòng
//         if (fetchedallroom.rooms && fetchedallroom.rooms.length > 0) {
//           fetchedallroom.rooms.forEach((room) => {
//             console.log("Cinema Name:", room.cinema.name);
//             console.log("Cinema Id:", room.cinema._id);
//             console.log("Room Name:", room.roomname);
//             console.log("Room Type:", room.roomtype);
//             console.log("Rows:", room.row);
//             console.log("Columns:", room.colum);
//             console.log("Seats:", room.seats);
//             console.log("Status:", room.status);
//           });
//           setSelectedRoom(fetchedallroom);
//         } else {
//           console.log("No rooms available.");
//         }
//       } catch (error) {
//         console.error("Error fetching rooms:", error);
//       }
//     };

//     fetchAllRoom();
//   }, []);

//   const openBookingModal = async (movie) => {
//     try {
//       const movieId = movie?.movieId?._id;
//       setSelectedMovieName(movie?.movieId?.name || "");

//       // Gọi API getMovieShowings
//       const response = await getMovieShowings(movieId);
//       console.log("API response:", response); // Kiểm tra dữ liệu trả về

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

//   const handleSelectCinema = (cinemaName, cinemaAddress) => {
//     const selectedCinema = selectedMovie.find(
//       (cinema) =>
//         cinema.cinemaName.toLowerCase() === cinemaName.toLowerCase() &&
//         cinema.address.toLowerCase() === cinemaAddress.toLowerCase()
//     );

//     console.log("Selected Cinema:", selectedCinema); // Xem thông tin của rạp được chọn

//     if (selectedCinema) {
//       setSelectedShowDates(selectedCinema.showDates || []);
//       setselectedShowTime(selectedCinema.showTimes || []);

//       console.log("Available CinemaId:", selectedCinema.cinemaId); // Kiểm tra cinemaId của selectedCinema
//       console.log("Available Roomsddd:", selectedRoom); // In thông tin selectedRoom

//       // Kiểm tra xem selectedRoom có tồn tại và có thuộc tính rooms hay không
//       // if (selectedRoom && Array.isArray(selectedRoom.rooms)) {
//       //   // Lọc phòng theo cinemaId
//       //   const filteredRooms = selectedRoom.rooms.filter(
//       //     (room) => room.cinema && room.cinema._id === selectedCinema.cinemaId
//       //   );

//       //   console.log("Filtered Rooms:", filteredRooms); // In kết quả sau khi lọc
//       //   setFilterRoom(filteredRooms); // Cập nhật kết quả
//       // }
//       if (selectedRoom && Array.isArray(selectedRoom.rooms)) {
//         const filteredRooms = selectedRoom.rooms.filter(
//           (room) => room.cinema && room.cinema._id === selectedCinema.cinemaId
//         );

//         // Dùng Map để loại bỏ trùng lặp theo roomtype
//         const uniqueRooms = new Map();
//         filteredRooms.forEach((room) => {
//           uniqueRooms.set(room.roomtype, room); // Chỉ giữ một phòng cho mỗi loại
//         });

//         console.log(
//           "Filtered Unique RoomTypes:",
//           Array.from(uniqueRooms.values())
//         );
//         setFilterRoom(Array.from(uniqueRooms.values())); // Cập nhật state
//       } else {
//         console.error("selectedRoom is undefined or rooms is not an array");
//       }
//     } else {
//       setSelectedShowDates([]);
//       setselectedShowTime([]);
//       setSelectedRoom([]);
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
//     <div>
//       {" "}
//       <TotalSlide />
//       <div className="booking-container">
//         <div>
//           <h2>Danh sách Rạp Chiếu Phim</h2>
//           {cinemas.length > 0 ? (
//             <ul>
//               {cinemas.map((cinema) => (
//                 <li key={cinema.id}>
//                   <h3>{cinema.name}</h3>
//                   <p>Địa chỉ: {cinema.address}</p>
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p>Không có rạp nào chiếu phim này.</p>
//           )}
//         </div>
//         <div className="movies-section">
//           <h2>🎬 Phim Đang Chiếu</h2>
//           <div className="movie-list">
//             {movieshowing.map((movie) => (
//               <Card
//                 key={movie.id}
//                 hoverable
//                 cover={<img alt={movie.title} src={movie.movieId.img} />}
//                 className="movie-card"
//               >
//                 <Card.Meta title={movie.movieId.name} />
//                 <Button
//                   type="primary"
//                   onClick={() => openBookingModal(movie)}
//                   className="book-button"
//                 >
//                   <PlusOutlined /> Đặt Vé
//                 </Button>
//               </Card>
//             ))}
//           </div>
//         </div>
//         {isBookingModalOpen && (
//           <Modal
//             title="Đặt Vé Xem Phim"
//             open={isBookingModalOpen}
//             onCancel={closeBookingModal}
//             footer={[
//               <Button key="cancel" onClick={closeBookingModal}>
//                 Hủy
//               </Button>,
//               <Button key="submit" type="primary" onClick={() => form.submit()}>
//                 Xác Nhận
//               </Button>,
//             ]}
//           >
//             {selectedMovie && (
//               <Form form={form} layout="vertical">
//                 <Form.Item
//                   label="Phim"
//                   name="movie"
//                   initialValue={selectedMovieName}
//                 >
//                   <Input disabled />
//                 </Form.Item>

//                 <Form.Item
//                   label="Chọn Rạp"
//                   name="cinema"
//                   rules={[{ required: true, message: "Vui lòng chọn rạp" }]}
//                 >
//                   <Select
//                     onChange={(value) => {
//                       const [cinemaName, cinemaAddress] = value.split("||");

//                       // Lấy cinemaId từ selectedMovie
//                       const selectedCinema = selectedMovie.find(
//                         (show) =>
//                           show.cinemaName === cinemaName &&
//                           show.address === cinemaAddress
//                       );

//                       if (selectedCinema) {
//                         console.log(
//                           "Cinema ID đã chọn:",
//                           selectedCinema.cinemaId
//                         );
//                         handleSelectCinema(
//                           cinemaName,
//                           cinemaAddress,
//                           selectedCinema.cinemaId
//                         );
//                       }
//                     }}
//                   >
//                     {selectedMovie.map((show, index) => (
//                       <Option
//                         key={index}
//                         value={`${show.cinemaName}||${show.address}`}
//                       >
//                         {show.cinemaName} - {show.address || "Chưa có địa chỉ"}
//                       </Option>
//                     ))}
//                   </Select>
//                 </Form.Item>

//                 <Form.Item
//                   label="Chọn Ngày"
//                   name="date"
//                   rules={[{ required: true }]}
//                 >
//                   <Select onChange={handleSelectDate}>
//                     {selectedShowDates?.map((date, index) => (
//                       <Option key={index} value={date}>
//                         {date}
//                       </Option>
//                     ))}
//                   </Select>
//                 </Form.Item>

//                 <Form.Item
//                   label="Chọn Giờ"
//                   name="showtime"
//                   rules={[{ required: true }]}
//                 >
//                   <Select>
//                     {Array.isArray(selectedShowTime) &&
//                       selectedShowTime.map((time, index) => (
//                         <Option key={index} value={time}>
//                           {time}
//                         </Option>
//                       ))}
//                   </Select>
//                 </Form.Item>

//                 <Form.Item
//                   label="Chọn Phòng"
//                   name="room"
//                   rules={[{ required: true }]}
//                 >
//                   <Select>
//                     {filterRoom.length > 0 ? (
//                       filterRoom.map((room, index) => (
//                         <Option key={index} value={room.roomtype}>
//                           {room.roomtype}
//                         </Option>
//                       ))
//                     ) : (
//                       <Option disabled>No rooms available</Option>
//                     )}
//                   </Select>
//                 </Form.Item>
//               </Form>
//             )}
//           </Modal>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Booking;

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Modal, Button } from "antd";
import TotalSlide from "./TotalSlide";
import "../components/styles/payment.css";

const Booking = () => {
  const { transactionId } = useParams();
  const [bookingInfo, setBookingInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(true);
  const navigate = useNavigate();
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    if (!transactionId) return;
    const fetchBooking = async () => {
      try {
        const response = await axios.get(`/booking/booking/${transactionId}`);
        const data = response.data.booking;
        setBookingInfo(data);
        // Kiểm tra trạng thái thanh toán
        if (data.status === "success") {
          setIsPaid(true);
        }
      } catch (error) {
        console.error("❌ Lỗi khi tải thông tin booking:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [transactionId]);

  const handleCloseModal = () => {
    setIsModalVisible(false);
    navigate("/booking");
  };

  const handlePayment = () => {
    if (isPaid) {
      console.log("Thanh toán đã hoàn tất!");
      return;
    }
    // Gọi API thanh toán hoặc xử lý thanh toán tại đây
    console.log("Tiến hành thanh toán...");
  };

  // Hiển thị TotalSlide nếu không có transactionId
  if (!transactionId) {
    return <TotalSlide />;
  }

  if (loading) {
    return <p>🔄 Đang tải thông tin vé...</p>;
  }

  if (!bookingInfo) {
    return <p>⚠️ Không tìm thấy thông tin vé.</p>;
  }

  return (
    <div className="ticket-container">
      <Modal
        title="🎟️ Vé Xem Phim"
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
      >
        <div className="ticket">
          <div className="ticket-header">
            <h2>{bookingInfo.movieName}</h2>
            <p>{new Date(bookingInfo.paymentTime).toLocaleDateString()}</p>
            <p>
              {bookingInfo.showtime} / {bookingInfo.seats.length} ghế
            </p>
          </div>
          <div className="ticket-body">
            <div className="ticket-info">
              <p>
                <strong>Rạp:</strong> {bookingInfo.cinema}
              </p>
              <p>
                <strong>Phòng chiếu:</strong> Cinema 5
              </p>
              <p>
                <strong>Ghế:</strong> {bookingInfo.seats.join(", ")}
              </p>
              <p>
                <strong>Số tiền:</strong> {bookingInfo.price.toLocaleString()} VND
              </p>
            </div>
            <div className="ticket-barcode">
              <img src={bookingInfo.qrCode} alt="QR Code" />
              <p className="ticket-transaction-id">{transactionId}</p>
            </div>
          </div>
          <div className="ticket-footer">
            <p>Vui lòng xuất trình mã QR này để vào rạp.</p>
            <p>
              <strong>Lưu ý:</strong> Vé đã mua không hoàn, không hủy.
            </p>
            <Button
              type="primary"
              onClick={handlePayment}
              disabled={isPaid}
              style={{ marginTop: 20 }}
            >
              {isPaid ? "Đã Thanh Toán" : "Thanh Toán Ngay"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Booking;
