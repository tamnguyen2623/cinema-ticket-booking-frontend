import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Modal, Button, Spin, Alert } from "antd";
import axios from "axios";
import TotalSlide from "./TotalSlide";
import "../components/styles/payment.css";

const Booking = () => {
  const { transactionId } = useParams();
  const [bookingInfo, setBookingInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!transactionId) return;
    const fetchBooking = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/booking/booking/${transactionId}`
        );
        setBookingInfo(response.data.booking);
      } catch (error) {
        console.error("error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [transactionId]);

  const handleCloseModal = () => {
    setIsModalVisible(false);
    navigate("/movielist");
  };

  if (!transactionId) {
    return <TotalSlide />;
  }

  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
        <p>Loading ticket information</p>
      </div>
    );
  }

  if (!bookingInfo) {
    return <Alert message="Not find ticket." type="error" />;
  }

  return (
    <div className="ticket-container">
      <Modal
        title="Movie ticket"
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
      >
        <div className="ticket">
          <div className="ticket-header">
            <h2>{bookingInfo.movieName || "not movie name"}</h2>
            <p>
              <span className="ticket-seat">
                Release date:{" "}
                {new Date(bookingInfo.paymentTime).toLocaleDateString()}
              </span>
            </p>
            <p>
              <span className="ticket-seat">
                Seat number: {bookingInfo.seats.length}
              </span>
            </p>
          </div>
          <div className="ticket-body">
            <div className="ticket-info">
              <p>
                <strong>Cinema:</strong> {bookingInfo.cinema}
              </p>
              <p>
                <strong>Show date:</strong>
                {new Intl.DateTimeFormat("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                }).format(new Date(bookingInfo.date))}
              </p>
              <p>
                <strong>Show time:</strong>
                {new Date(bookingInfo.showtime).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>
              <p>
                <strong>Theater:</strong>
                {bookingInfo.room || "unknow"}
              </p>
              <p>
                <strong>Seat:</strong> {bookingInfo.seats.join(", ")}
              </p>
              <p>
                <strong>Total Price:</strong> $
                {bookingInfo.price.toLocaleString()}
              </p>
            </div>
            <div className="ticket-barcode">
              {bookingInfo.qrCode ? (
                <img src={bookingInfo.qrCode} alt="QR Code" />
              ) : (
                <p>Loading QR Code...</p>
              )}
            </div>
          </div>
          <div className="ticket-footer">
            <p>Show QR code to enter the theater.</p>
            <p>
              <strong>Note:</strong> Purchased tickets cannot be cancelled or
              refunded.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Booking;
