import React, { useEffect, useState } from "react";
import { getSeatAvailablesBymovieShowingId } from "../api/seatAvailable";

export default function SeatAvailableForAdmin({ movieShowing }) {
  const [seats, setSeats] = useState([]);
  const column = movieShowing.roomId.colum;
  console.log(movieShowing);
  

  const fetchSeats = async () => {
    try {
      const data = await getSeatAvailablesBymovieShowingId(movieShowing._id);
      setSeats(data); // Cập nhật state với dữ liệu từ API
      console.log(data);
    } catch (error) {
      console.error("Failed to fetch seats:", error);
    }
  };

  useEffect(() => {
    fetchSeats();
  }, [movieShowing]);

  const seatTypeColors = {
    Standard: "bg-purple-500",
    VIP: "bg-red-500",
    Premium: "bg-pink-500",
    Disabled:
      "relative bg-yellow-100 after:content-[''] after:absolute after:top-2.5 after:right-2.5 after:w-full after:h-full after:border-t-2 after:border-red-500 after:rotate-45 after:pointer-events-none",
  };

  return (
    <div className="p-11">
      {/* <h2 className="text-xl mb-4 text-center">Cập nhật ghế phòng chiếu</h2> */}
      <div className="bg-gray-800 text-white py-2 text-center mb-4">
        MÀN HÌNH
      </div>
      <div
        className="grid gap-2 ml-9"
        style={{ gridTemplateColumns: `repeat(${column}, minmax(40px, 1fr))` }}
      >
        {seats.map((seat) => {
          const isDisabled =
            seat.seatId.type === "Disabled" || seat.isAvailable === false;

          return (
            <div
              key={seat.seatId._id}
              className={`w-8 h-8 flex items-center justify-center text-xs ${
                isDisabled
                  ? "relative bg-yellow-100 after:content-[''] after:absolute after:top-2.5 after:right-2.5 after:w-full after:h-full after:border-t-2 after:border-red-500 after:rotate-45 after:pointer-events-none"
                  : seatTypeColors[seat.seatId.type]
              }`}
            >
              {seat.seatId.name}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex gap-4 justify-center">
        <span className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-500"></div>Ghế thường
        </span>
        <span className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500"></div>Ghế VIP
        </span>
        <span className="flex items-center gap-2">
          <div className="w-4 h-4 bg-pink-500"></div>Ghế Premium
        </span>
        <span className="flex items-center gap-2">
          <div className="relative w-4 h-4 bg-yellow-100 after:content-[''] after:absolute after:top-1 after:right-1 after:w-full after:h-full after:border-t-2 after:border-red-500 after:rotate-45 after:pointer-events-none"></div>
          Đã đặt
        </span>
      </div>
    </div>
  );
}
