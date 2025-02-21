import React, { useEffect, useState } from "react";
import { Menu } from "antd";
import { updateSeat } from "../api/seat";

export default function seatUpdate({ seat, seatTypeColors, setRefresh }) {

  const handleUpdateSeat = (newType) => {
    try {
      updateSeat(seat._id, { ...seat, type: newType });
      console.log(`Đã cập nhật ghế ${seat.name} thành ${newType}`);
      // fetchSeats(); // Load lại danh sách ghế
      setRefresh((prev) => !prev); // Đảo giá trị để trigger useEffect
    } catch (error) {
      console.log("Update seat error:", error);
    }
  };
  
  return (
    <Menu
      className="flex justify-between"
      style={{ width: "150%", padding: "8px" }}
    >
      <Menu.Item
        className={`inline-block w-8 h-8 items-center justify-center text-xs ${seatTypeColors["Standard"]}`}
        onClick={() => handleUpdateSeat("Standard")}
      >
        {seat.name}
      </Menu.Item>
      <Menu.Item
        className={`inline-block w-8 h-8 items-center justify-center text-xs ${seatTypeColors["VIP"]}`}
        onClick={() => handleUpdateSeat("VIP")}
      >
        {seat.name}
      </Menu.Item>
      <Menu.Item
        className={`inline-block w-8 h-8 items-center justify-center text-xs ${seatTypeColors["Premium"]}`}
        onClick={() => handleUpdateSeat("Premium")}
      >
        {seat.name}
      </Menu.Item>
      <Menu.Item
        className={`inline-block w-8 h-8 items-center justify-center text-xs ${seatTypeColors["Disabled"]}`}
        onClick={() => handleUpdateSeat("Disabled")}
      >
        {seat.name}
      </Menu.Item>
    </Menu>
  );
}
