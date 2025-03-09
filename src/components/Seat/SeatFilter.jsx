import React from "react";
import { Select } from "antd";

export default function SeatFilter({ options, onFilterChange }) {
  const handleChange = (selectedValues) => {
    console.log("Selected seat types:", selectedValues);
    onFilterChange(selectedValues); // Gọi hàm từ Seat.jsx
  };

  return (
    <Select
      mode="multiple"
      style={{ width: "30%" }}
      placeholder="Select seat type"
      onChange={handleChange}
      options={options}
    />
  );
}
