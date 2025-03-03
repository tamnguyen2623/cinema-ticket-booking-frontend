import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Modal, Spin } from "antd";
import { toast } from "react-toastify";
import axios from "axios";
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
        console.error("Error fetching booking:", error);
        toast.error("Failed to load booking details!");
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [transactionId]);
  useEffect(() => {
    if (!bookingInfo && !loading) {
      toast.error("Ticket not found!");
    }
  }, [bookingInfo, loading]);
  useEffect(() => {
    if (bookingInfo?.status === "failed") {
      toast.error("Payment Failed. Please try again!");
      navigate("/movielist");
    }
  }, [bookingInfo?.status]);

  const handleCloseModal = () => {
    setIsModalVisible(false);
    navigate("/movielist");
  };
  if (loading) {
    return (
      <div className="loading-container">
        <Spin size="large" />
        <p>Loading ticket information...</p>
      </div>
    );
  }
  return (
    <div className="ticket-container">
      {isModalVisible && bookingInfo.status !== "failed" && (
        <Modal
          title="Movie Ticket"
          open={isModalVisible}
          onCancel={handleCloseModal}
          footer={null}
          width={700}
        >
          <div className="ticket">
            <div className="ticket-header">
              <h2>{bookingInfo.movieName || "No movie name"}</h2>
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
                  <strong>Show date:</strong>{" "}
                  {new Intl.DateTimeFormat("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  }).format(new Date(bookingInfo.date))}
                </p>
                <p>
                  <strong>Show time:</strong>{" "}
                  {new Date(bookingInfo.showtime).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
                <p>
                  <strong>Theater:</strong> {bookingInfo.room || "Unknown"}
                </p>
                <p>
                  <strong>Seat:</strong> {bookingInfo.seats.join(", ")}
                </p>
                {bookingInfo.combo && bookingInfo.combo.length > 0 ? (
                  <p className="combo-list">
                    <strong>Combo:</strong> {bookingInfo.combo.join(", ")}
                  </p>
                ) : (
                  <p>
                    <strong>Combo:</strong> None
                  </p>
                )}
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
      )}
    </div>
  );
};

export default Booking;
