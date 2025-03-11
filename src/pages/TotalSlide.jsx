import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { message, Radio, Button } from "antd";
import { toast } from "react-toastify";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "../components/styles/slide.css";
import { fetchTicket } from "../components/api/bookingApi";
import Voucher from "../pages/VoucherCustomer/VoucherCustomer";
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
        console.log(" fetchTicket", response);
      } catch (error) {
        console.error("Error fetching ticket:", error);
        toast.error("Failed to load ticket details!");
      }
    };

    loadTicket();
  }, [auth.token]);

  // useEffect(() => {}, [id, bookingData]);

  if (!bookingData) {
    return (
      <div className="payment-container">
        <h2>Ticket Details</h2>
        <p>
          No ticket data found. Please select a ticket before viewing details.
        </p>
      </div>
    );
  }
  console.log("bookingData", bookingData);
  const selectedSeats = bookingData.selectedSeats || [];
  const selectedCombos = bookingData.selectedCombos || [];
  const selectedShowing = bookingData.selectedShowtime || [];
  const [totalTicket, setTotalTicket] = useState(0);

  const findMatchingPrice = (roomType, seatType) => {
    const matchingTicket = ticketPrice.find(
      (ticket) => ticket.roomType === roomType && ticket.seatType === seatType
    );
    return matchingTicket ? matchingTicket.price : 0;
  };

  useEffect(() => {
    if (!selectedSeats || selectedSeats.length === 0 || !selectedShowing.room)
      return;
    const ticketTotal = selectedSeats.reduce((sum, seat) => {
      return (
        sum + findMatchingPrice(selectedShowing.room.roomtype, seat.seatId.type)
      );
    }, 0);
    setTotalTicket(ticketTotal);
    console.log(" Total Ticket Price:", ticketTotal);
  }, [selectedSeats, selectedShowing, ticketPrice]);

  const [totalPrice, setTotalPrice] = useState(0);
  useEffect(() => {
    if (!bookingData) return;
    const totalCombo = bookingData.selectedCombos
      ? bookingData.selectedCombos.reduce(
        (sum, combo) => sum + combo.price * combo.quantity,
        0
      )
      : 0;
    const voucherDiscount = bookingData.selectedVoucher
      ? (totalTicket + totalCombo) *
      (bookingData.selectedVoucher.discount / 100)
      : 0;
    setTotalPrice(totalTicket + totalCombo - voucherDiscount);
    console.log(" Total Ticket:", totalTicket);
    console.log(" Total Combo:", totalCombo);
    console.log(" Voucher Discount:", voucherDiscount);
    console.log(
      " Final Total Price:",
      totalTicket + totalCombo - voucherDiscount
    );
  }, [bookingData, totalTicket]);

  console.log(totalPrice);

  const handlePayment = async () => {
    if (!auth?.token) {
      return toast.error("Please log in to proceed with the payment!");
    }

    try {
      const currency = "USD";

      // Khởi tạo requestData
      const requestData = {
        movieId: bookingData.selectedMovie?._id,
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
        combo: selectedCombos.map(
          (combo) => `${combo.name} (x${combo.quantity})`
        ),
        currency,
        ...(bookingData.selectedVoucher?._id && {
          voucherId: bookingData.selectedVoucher._id,
          discount: bookingData.selectedVoucher.discount || 0,
        }),
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
        toast.error("No payment URL returned!");
      }
    } catch (error) {
      console.error(" Payment error:", error.response?.data || error.message);
      toast.error(`Payment failed! ${error.response?.data?.message || ""}`);
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
              <strong>Seats:</strong>
              {selectedSeats && selectedSeats.length > 0 ? (
                <ul className="seat-list">
                  {selectedSeats.map((seat) => {
                    const seatPrice = findMatchingPrice(
                      selectedShowing.room.roomtype,
                      seat.seatId.type
                    );
                    return (
                      <li key={seat._id} className="seat-item">
                        <span className="seat-name">{seat.seatId.name}</span>
                        <span className="seat-type">({seat.seatId.type})</span>
                        <span className="seat-price">
                          - ${seatPrice.toLocaleString()}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                "No seats selected"
              )}
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
              <strong>Combo:</strong>
              {bookingData.selectedCombos &&
                bookingData.selectedCombos.length > 0 ? (
                <ul className="combo-quantity">
                  {bookingData.selectedCombos.map((combo) => (
                    <li key={combo._id} className="combo-item">
                      <span className="combo-name">{combo.name}</span>
                      <span className="combo-qty">
                        Quantity: {combo.quantity}
                      </span>
                      <span className="combo-qty">${combo.price} / combo</span>
                    </li>
                  ))}
                </ul>
              ) : (
                "No combo selected"
              )}
            </p>
          </div>
          <Voucher setBookingData={setBookingData} />
          <p className="total-price">
            <strong>Total Price: </strong>
            {`$ ${totalPrice.toLocaleString()}`}
          </p>
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
