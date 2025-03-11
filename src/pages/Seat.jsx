import React, { useState } from "react";
import SeatFilter from "../components/Seat/SeatFilter";
import SeatTable from "../components/Seat/SeatTable";
import { Typography } from "antd";
import { Padding } from "@mui/icons-material";
const { Title } = Typography;

const options = [
  { label: "Standard", value: "Standard" },
  { label: "VIP", value: "VIP" },
  { label: "Premium", value: "Premium" },
  { label: "Disabled", value: "Disabled" },
];

export default function Seat() {
  const [selectedTypes, setSelectedTypes] = useState([]); // State để lưu các loại ghế được chọn

  // Hàm cập nhật bộ lọc
  const handleFilterChange = (selectedValues) => {
    setSelectedTypes(selectedValues);
  };

  return (
    <div className="p-8">
      <Title>List of seats</Title>
      <div style={{ marginBottom: 16 }}>
        <SeatFilter options={options} onFilterChange={handleFilterChange} />
      </div>
      <SeatTable options={options} selectedTypes={selectedTypes} />
    </div>
  );
}
