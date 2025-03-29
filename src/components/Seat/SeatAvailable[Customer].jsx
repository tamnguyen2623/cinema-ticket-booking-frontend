import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { getSeatAvailablesBymovieShowingId } from "../api/seatAvailable";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext"; // Import AuthContext

export default function SeatAvailableForCustomer() {
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [movieShowing, setMovieShowing] = useState();
  const { auth } = useContext(AuthContext);
  const { id } = useParams(); // Lấy _id từ URL
  const navigate = useNavigate();

  const fetchSeats = async () => {
    try {
      const movieShowingRes = await axios.get(
        `http://localhost:8080/movieshowing/${id}`
      );
      const data = await getSeatAvailablesBymovieShowingId(id);
      setSeats(data);
      setMovieShowing(movieShowingRes.data.data);
      console.log(movieShowing);
      console.log(data);
    } catch (error) {
      console.error("Failed to fetch seats:", error);
    }
  };

  useEffect(() => {
    fetchSeats();
  }, [id]);

  const seatTypeColors = {
    Standard: "text-white bg-purple-500",
    VIP: "text-white bg-red-500",
    Premium: "text-white bg-pink-500",
  };

  // Hàm xử lý chọn ghế
  const handleSelectSeat = (seat) => {
    const isDisabled =
      seat.type === "Disabled" || seat.isAvailable === false;
    if (isDisabled) return; // Không cho phép chọn ghế đã bị disable

    setSelectedSeats((prev) =>
      prev.some((s) => s._id === seat._id)
        ? prev.filter((s) => s._id !== seat._id)
        : [...prev, seat]
    );
  };

  // // Hàm gửi danh sách ghế đã chọn
  // const handleConfirmSelection = () => {
  //   const seatIds = selectedSeats.map((s) => s._id); // Lấy danh sách _id

  //   console.log("Suất chiếu: ", movieShowing);
  //   console.log("Thông tin chi tiết của các ghế: ", selectedSeats);
  //   console.log("Danh sách ID ghế đã chọn: ", seatIds);

  //   alert(
  //     `Ghế bạn đã chọn: ${selectedSeats.map((s) => s.name).join(", ")}`
  //   );
  // };

  const handleConfirmSelection = () => {
    if (selectedSeats.length === 0) {
      alert("Bạn chưa chọn ghế nào!");
      return;
    }

    const seatNames = selectedSeats.map((s) => s.name).join(", ");
    // const seatIds = selectedSeats.map((s) => s._id);

    // ✅ Hiển thị thông báo trước khi điều hướng
    // alert(`Bạn đã chọn ghế: ${seatNames}`);

    // ✅ Cập nhật `localStorage`
    const existingBookingData =
      JSON.parse(localStorage.getItem("bookingData")) || {};
    const updatedBookingData = {
      ...existingBookingData,
      selectedSeats: selectedSeats, // Chỉ lưu khi bấm xác nhận
    };
    localStorage.setItem("bookingData", JSON.stringify(updatedBookingData));

    console.log("🔹 Ghế đã lưu vào localStorage:", updatedBookingData);

    // ✅ Dùng `setTimeout()` để đảm bảo `navigate()` hoạt động
    setTimeout(() => {
      navigate("/combocustomer");
      // navigate("/totalslide");
    }, 1);
  };

  return (
    <div className="p-11">
      <div className="text-white py-2 text-center mb-4" style={{backgroundColor:"#231F20"}}>
        SCREEN
      </div>
      <div
        className="grid gap-2 ml-9"
        style={{
          gridTemplateColumns: `repeat(${movieShowing?.roomId.colum}, minmax(40px, 1fr))`,
        }}
      >
        {seats.map((seat) => {
          const isDisabled =
            seat.type === "Disabled" || seat.isAvailable === false;
          const isSelected = selectedSeats.some((s) => s._id === seat._id);

          return (
            <div
              key={seat._id}
              className={`w-8 h-8 flex items-center justify-center text-xs cursor-pointer ${
                isDisabled
                  ? "relative bg-yellow-100 after:content-[''] after:absolute after:top-2.5 after:right-2.5 after:w-full after:h-full after:border-t-2 after:border-red-500 after:rotate-45 after:pointer-events-none"
                  : seatTypeColors[seat.type]
              } ${isSelected ? "border-2 border-black" : ""}`}
              onClick={() => handleSelectSeat(seat)}
            >
              {seat.name}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex gap-4 justify-center">
        <span className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-500"></div>Standard
        </span>
        <span className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500"></div>VIP
        </span>
        <span className="flex items-center gap-2">
          <div className="w-4 h-4 bg-pink-500"></div>Premium
        </span>
        <span className="flex items-center gap-2">
          <div className="relative w-4 h-4 bg-yellow-100 after:content-[''] after:absolute after:top-1 after:right-1 after:w-full after:h-full after:border-t-2 after:border-red-500 after:rotate-45 after:pointer-events-none"></div>
          Booked
        </span>
      </div>

      {selectedSeats.length > 0 && (
        <div className="mt-12 flex justify-center">
          <button
            className="px-4 py-2 rounded-md font-medium"
            style={{backgroundColor: "#DAD2B4", color: "#231F20"}}
            onClick={handleConfirmSelection}
          >
            Confirm selected seat ({selectedSeats.length})
          </button>
        </div>
      )}
    </div>
  );
}
