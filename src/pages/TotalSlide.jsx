import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { message, Radio, Button } from "antd";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "../components/styles/slide.css";
import { fetchTicket } from "../components/api/ticketApi";
export default function PaymentTicket() {
  const { auth } = useContext(AuthContext);
  const { id } = useParams();
  const [paymentMethod, setPaymentMethod] = useState("vnpay");
  const [ticketPrice, setTicketPrice] = useState([]);
  const [bookingData, setBookingData] = useState(() => {
    try {
      const savedBooking = localStorage.getItem("bookingData");
      return savedBooking ? JSON.parse(savedBooking) : null;
    } catch (error) {
      console.error(" Error retrieving data from localStorage:", error);
      return null;
    }
  });

  useEffect(() => {
    const loadTicket = async () => {
      try {
        const response = await fetchTicket(auth.token);
        setTicketPrice(response);
      } catch (error) {
        console.error("Error fetching ticket:", error);
        message.error("Failed to load ticket details!");
      }
    };

    loadTicket();
  }, [auth.token]);

  useEffect(() => {}, [id, bookingData]);

  if (!bookingData) {
    return (
      <div className="payment-container">
        <h2>Ticket Details</h2>
        <p>
          No ticket data found. Please select a ticket before viewing
          details.
        </p>
      </div>
    );
  }

  const selectedSeats = bookingData.selectedSeats || [];
  const selectedShowing = bookingData.selectedShowtime || [];
  const seatNames = selectedSeats.map((seat) => seat.seatId.name).join(", ");
  console.log(bookingData);

  const findMatchingPrice = (roomType, seatType) => {
    const matchingTicket = ticketPrice.find(
      (ticket) => ticket.roomType === roomType && ticket.seatType === seatType
    );
    return matchingTicket ? matchingTicket.price : 0;
  };
  const totalPrice = selectedSeats.reduce((sum, seat) => {
    return (
      sum + findMatchingPrice(selectedShowing.room.roomtype, seat.seatId.type)
    );
  }, 0);
  const handlePayment = async () => {
    if (!auth?.token) {
      return message.error("Please log in to proceed with the payment!");
    }

    try {
      const currency = "USD";
      const requestData = {
        movieName: bookingData.selectedMovie?.name || "N/A",
        cinema: bookingData.selectedCinema?.name || "N/A",
        address: bookingData.selectedCinema?.address || "N/A",
        seats: selectedSeats.map((seat) => seat.seatId.name),
        seatsId: selectedSeats.map((seat) => seat._id),
        showtime: new Date(
          bookingData.selectedShowtime?.showtime?.showtime
        ).toISOString(),
        room: selectedShowing.room?.roomname || "N/A",
        date: bookingData.selectedDate || "N/A",
        price: totalPrice,
        currency,
      };
      const response = await axios.post(
        `http://localhost:8080/booking/booking/${paymentMethod}/order`,
        requestData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );

      if (response.data.paymentUrl) {
        window.location.href = response.data.paymentUrl;
      } else {
        message.error("No payment URL returned!");
      }
    } catch (error) {
      console.error(" Payment error:", error.response?.data || error.message);
      message.error(`Payment failed! ${error.response?.data?.message || ""}`);
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-ticket">
        <div className="payment-left">
          <img
            src={bookingData.selectedMovie?.img}
            alt={bookingData.selectedMovie?.name}
            className="movie-poster"
          />
        </div>
        <div className="payment-right">
          <h2 className="movie-title">{bookingData.selectedMovie?.name}</h2>
          <div className="payment-info">
            <p>
              <strong>Date:</strong> {bookingData.selectedDate}
            </p>
            <p>
              <strong>Cinema:</strong> {bookingData.selectedCinema?.name}
            </p>
            <p>
              <strong>Address:</strong> {bookingData.selectedCinema?.address}
            </p>
            <p>
              <strong>Seats:</strong> {seatNames || "No seats selected"}
            </p>
            <p>
              <strong>Screening Room:</strong>
              {selectedShowing.room.roomname} - {selectedShowing.room.roomtype}
            </p>
            <p>
              <strong>Showtime: </strong>
              {new Date(selectedShowing.showtime.showtime).toLocaleTimeString(
                "en-US",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                }
              )}
            </p>
            <p>
              <strong>Total Price: </strong>
              {`$ ${totalPrice.toLocaleString()}`}
            </p>
          </div>
          <div className="payment-method">
            <h3>Select Payment Method</h3>
            <Radio.Group
              onChange={(e) => setPaymentMethod(e.target.value)}
              value={paymentMethod}
            >
              <Radio value="vnpay">VNPay</Radio>
              <Radio value="momo">MoMo</Radio>
            </Radio.Group>
          </div>

          <Button
            type="primary"
            className="payment-button"
            onClick={handlePayment}
          >
            Pay Now
          </Button>
        </div>
      </div>
    </div>
  );
}
