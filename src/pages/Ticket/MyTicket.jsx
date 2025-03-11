import React, { useContext, useEffect, useState } from 'react';
import { Card, Spin, Alert, Tag, Typography, Row, Col } from 'antd';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import './MyTicket.css'
// import { QRCode, QRCodeSVG } from "qrcode.react";
const { Title } = Typography;

const MyTicket = () => {
  const { auth } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate()

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
      setBookings(bookingsData);
    } catch (err) {
      setError('Lỗi khi tải danh sách vé.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [auth.userId]);

  if (loading) return <Spin tip="Đang tải danh sách vé..." className="w-full flex justify-center" />;
  if (error) return <Alert message={error} type="error" showIcon className="my-4" />;
  return (
    <div className="container">
      {/* <h3 className="title-header"> MY TICKET</h3> */}
      <div className="sub-container">
        {bookings.length === 0 ? (
          <Alert message="Bạn chưa đặt vé nào." type="info" showIcon />
        ) : (
          <Row gutter={[12, 12]} justify="space-around">
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
