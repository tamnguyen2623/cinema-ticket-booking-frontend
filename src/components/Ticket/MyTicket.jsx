import React, { useContext, useEffect, useState } from 'react';
import { Card, Spin, Alert, Tag, Typography, Row, Col } from 'antd';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import dayjs from 'dayjs';

const { Title } = Typography;

const MyTicket = () => {
  const { auth } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <>
      <Title level={3} className="text-center mb-6">🎟️ Danh sách vé đã đặt</Title>
      {bookings.length === 0 ? (
        <Alert message="Bạn chưa đặt vé nào." type="info" showIcon />
      ) : (
        <Row gutter={[16, 16]} justify={'space-between'}>
          {bookings.map((ticket) => (
            <Col xs={24} sm={12} md={8}  key={ticket._id}>
              <Card
                title={<span className="font-semibold text-blue-600">🎬 {ticket.movieName}</span>}
                bordered={false}
                className="rounded-2xl shadow-md hover:shadow-lg transition-all duration-200"
              >
                <div className="mb-2">
                  <span className="font-medium">🏢 Rạp:</span> {ticket.cinema}
                </div>
                <div className="mb-2">
                  <span className="font-medium">📅 Ngày chiếu:</span> {dayjs(ticket.date).format('DD/MM/YYYY')}
                </div>
                <div className="mb-2">
                  <span className="font-medium">💺 Ghế:</span> {ticket.seats.join(', ')}
                </div>
                <div className="mb-2">
                  <span className="font-medium">💵 Giá:</span> {ticket.price.toLocaleString()} VNĐ
                </div>
                <Tag color={{ success: 'green', pending: 'orange', failed: 'red', cancelled: 'volcano' }[ticket.status]}>
                  {ticket.status.toUpperCase()}
                </Tag>
                <div className="mt-2 text-sm text-gray-500">🔑 Mã giao dịch: {ticket.transactionId}</div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default MyTicket;
