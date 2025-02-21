// import React, { useEffect, useState } from "react";
// import { Card, Row, Col, Typography, Image, Divider } from "antd";

// const { Title, Text } = Typography;

// // Đối tượng booking ban đầu
// const initialBooking = {
//   img: "https://m.media-amazon.com/images/I/71niXI3lxlL._AC_SL1500_.jpg",
//   name: "Avenger",
//   date: "17/02/2025",
//   showtime: "19:30 ~ 21:30",
//   cinema: "CGV - Can Tho",
//   seat: "A1, A2",
//   total: "$20",
// };

// export default function Booking() {
//   const [booking, setBooking] = useState({});
//   useEffect(() => {
//     setBooking(initialBooking);
//   }, []);

//   return (
//     <Card bordered style={{ maxWidth: 800, margin: "20px auto" }}>
//       {booking.name ? (
//         <Row gutter={16} align="middle">
//           <Col span={6}>
//             <Image
//               src={booking.img}
//               alt={booking.name}
//               style={{ borderRadius: 10 }}
//             />
//             <Title level={4} style={{ marginTop: 10, textAlign: "center" }}>
//               {booking.name}
//             </Title>
//           </Col>
//           <Col span={12}>
//             <Title level={4}>🎟️ Thông Tin Vé</Title>
//             <Divider />
//             <Text>
//               <strong>📅 Ngày:</strong> {booking.date}
//             </Text>
//             <br />
//             <Text>
//               <strong>🕒 Giờ chiếu:</strong> {booking.showtime}
//             </Text>
//             <br />
//             <Text>
//               <strong>🏛️ Rạp:</strong> {booking.cinema}
//             </Text>
//             <br />
//             <Text>
//               <strong>💺 Ghế ngồi:</strong> {booking.seat}
//             </Text>
//           </Col>
//           <Col span={6} style={{ textAlign: "center" }}>
//             <Title level={4}>💰 Tổng Giá</Title>
//             <Divider />
//             <Title level={3} style={{ color: "#e74c3c" }}>
//               {booking.total}
//             </Title>
//           </Col>
//         </Row>
//       ) : (
//         <Text>Đang tải dữ liệu...</Text>
//       )}
//     </Card>
//   );
// }

import React, { useEffect, useState, useContext } from "react";

import {
  Card,
  Row,
  Col,
  Typography,
  Image,
  Divider,
  Button,
  message,
} from "antd";
import axios from "axios";

const { Title, Text } = Typography;
import { AuthContext } from "../context/AuthContext";
// Đối tượng booking ban đầu
const initialBooking = {
  img: "https://m.media-amazon.com/images/I/71niXI3lxlL._AC_SL1500_.jpg",
  name: "Avenger",
  date: "17/02/2025",
  showtime: "19:30 ~ 21:30",
  cinema: "CGV - Can Tho",
  seat: "A1, A2",
  total: 20,
};

export default function Booking() {
  const [booking, setBooking] = useState({});
  const { auth } = useContext(AuthContext);
  useEffect(() => {
    setBooking(initialBooking);
  }, []);

  const handlePayment = async () => {
    if (!auth?.token) {
      return message.error("⚠️ Vui lòng đăng nhập để thanh toán!");
    }

    try {
      const response = await axios.post(
        "/booking/booking/vnpay/order",
        {
          price: 200000, // Gán cứng giá trị hợp lệ
          seats: "A1, A2",
          showtime: "19:30 ~ 21:30",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      // Kiểm tra phản hồi từ server
      console.log("📦 Response từ server:", response.data);

      if (response.data.paymentUrl) {
        console.log("🌐 Chuyển hướng đến:", response.data.paymentUrl);
        window.location.href = response.data.paymentUrl;
      } else {
        console.error("❌ Không có URL thanh toán được trả về!");
        message.error("Không thể tạo yêu cầu thanh toán.");
      }
    } catch (error) {
      console.error("💥 Lỗi xử lý thanh toán:", error);
      message.error("Thanh toán không thành công!");
    }
  };

  return (
    <Card bordered style={{ maxWidth: 800, margin: "20px auto" }}>
      {booking.name ? (
        <Row gutter={16} align="middle">
          {/* Cột 1: Thông tin phim */}
          <Col span={6}>
            <Image
              src={booking.img}
              alt={booking.name}
              style={{ borderRadius: 10 }}
            />
            <Title level={4} style={{ marginTop: 10, textAlign: "center" }}>
              {booking.name}
            </Title>
          </Col>

          {/* Cột 2: Thông tin vé */}
          <Col span={12}>
            <Title level={4}>🎟️ Thông Tin Vé</Title>
            <Divider />
            <Text>
              <strong>📅 Ngày:</strong> {booking.date}
            </Text>
            <br />
            <Text>
              <strong>🕒 Giờ chiếu:</strong> {booking.showtime}
            </Text>
            <br />
            <Text>
              <strong>🏛️ Rạp:</strong> {booking.cinema}
            </Text>
            <br />
            <Text>
              <strong>💺 Ghế ngồi:</strong> {booking.seat}
            </Text>
          </Col>

          {/* Cột 3: Tổng giá và nút thanh toán */}
          <Col span={6} style={{ textAlign: "center" }}>
            <Title level={4}>💰 Tổng Giá</Title>
            <Divider />
            <Title level={3} style={{ color: "#e74c3c" }}>
              ${booking.total}
            </Title>
            <Button
              type="primary"
              onClick={handlePayment}
              style={{ marginTop: 20 }}
            >
              Thanh toán
            </Button>
          </Col>
        </Row>
      ) : (
        <Text>Đang tải dữ liệu...</Text>
      )}
    </Card>
  );
}
