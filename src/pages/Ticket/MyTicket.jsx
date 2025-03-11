import React, { useContext, useEffect, useState } from "react";
import { Card, Spin, Alert, Tag, Typography, Row, Col } from "antd";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import "./MyTicket.css";

// import { QRCode, QRCodeSVG } from "qrcode.react";
const { Title } = Typography;
import "./MyTicket.css";

const MyTicket = () => {
  const { auth } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const [addModal, setAddModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [booking, setBooking] = useState();
  const [refresh, setRefresh] = useState(false);

  const showModal = (booking) => {
    setBooking(booking); // Lưu suất chiếu vào state
    if (booking.isFeedback) {
      setViewModal(true);
      return;
    }
    setAddModal(true); // Mở modal
  };

  const handleCancelAddModal = () => {
    setAddModal(false);
    setRefresh(!refresh);
  };

  const handleCancelViewModal = () => {
    setViewModal(false);
  };

  const fetchBookings = async () => {
    if (!auth?.userId) {
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get(`/booking/booking/user/${auth.userId}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      const bookingsData = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data.bookings)
        ? response.data.bookings
        : [];
      console.log(bookingsData);

      setBookings(bookingsData);
    } catch (err) {
      setError("Lỗi khi tải danh sách vé.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [auth.userId]);

  if (loading)
    return (
      <Spin
        tip="Đang tải danh sách vé..."
        className="w-full flex justify-center"
      />
    );
  if (error)
    return <Alert message={error} type="error" showIcon className="my-4" />;
  return (
    <div className="head-container">
      {/* <h3 className="title-header"> MY TICKET</h3> */}
      <div className="sub-container">
        {bookings.length === 0 ? (
          <Alert message="Bạn chưa đặt vé nào." type="info" showIcon />
        ) : (

          <Row gutter={[16, 16]} justify="space-between">
            {bookings.map((ticket) => (
              <Col key={ticket._id}>
                <Card
                  bordered={false}
                  className="ticket-card"
                  onClick={() => navigate(`/myticketdetail/${ticket._id}`)}
                >
                  <div className="ticket-content">
                    {/* Ảnh phim bên trái */}
                    <div className="img-movie">
                      <img src={ticket.movieImage} alt={ticket.movieName} />
                    </div>

                    {/* Thông tin vé bên phải */}
                    <div className="information-ticket">
                      <h3> {ticket.movieName}</h3>
                      <div><strong>Rạp:</strong> {ticket.cinema}</div>
                      <div><strong>Ngày chiếu:</strong> {dayjs(ticket.date).format('DD/MM/YYYY')}</div>
                      <div><strong>Ghế:</strong> {ticket.seats.join(', ')}</div>
                      <div><strong>Giá:</strong> {ticket.price.toLocaleString()} $</div>

                      <Tag color={{
                        success: 'green',
                        pending: 'orange',
                        failed: 'red',
                        cancelled: 'volcano'
                      }[ticket.status]}>
                        {ticket.status.toUpperCase()}
                      </Tag>

                    </div>

                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
};
export default MyTicket;
