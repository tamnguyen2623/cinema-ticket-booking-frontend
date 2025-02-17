import React, { useEffect, useState } from "react";

export default function SeatMap() {
  const [seats, setSeats] = useState([]);

//   useEffect(() => {
//     axios
//       .get("/api/seats")
//       .then((response) => setSeats(response.data))
//       .catch((error) => console.error("Error fetching seats:", error));
//   }, []);

  const seatTypeColors = {
    Standard: "bg-purple-500",
    VIP: "bg-red-500",
    Premium: "bg-pink-500",
    Disabled: "bg-black",
  };

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4 text-center">Cập nhật ghế phòng chiếu</h2>
      <div className="bg-gray-800 text-white py-2 text-center mb-4">
        MÀN HÌNH
      </div>
      <div className="grid grid-cols-16 gap-2">
        {seats.map((seat) => (
          <div
            key={seat.name}
            className={`w-10 h-10 flex items-center justify-center ${
              seatTypeColors[seat.type]
            }`}
          >
            {seat.name}
          </div>
        ))}
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
          <div className="w-4 h-4 bg-black"></div>Không khả dụng
        </span>
      </div>
    </div>
  );
}
