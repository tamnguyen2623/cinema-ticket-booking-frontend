import React, { useState, useEffect } from "react";
import { Table, Select } from "antd";
import { getAll, updateSeat } from "../api/seat";

export default function SeatTable({ options, selectedTypes }) {
  const [seats, setSeats] = useState([]);
  const [filteredSeats, setFilteredSeats] = useState([]); // Dữ liệu sau khi lọc

  useEffect(() => {
    fetchSeats();
  }, []);

  const fetchSeats = async () => {
    try {
      const data = await getAll();
      setSeats(data);
      setFilteredSeats(data); // Ban đầu hiển thị tất cả ghế
    } catch (error) {
      console.error("Failed to fetch seats:", error);
    }
  };

  // Khi `selectedTypes` thay đổi, lọc danh sách ghế
  useEffect(() => {
    if (selectedTypes.length === 0) {
      setFilteredSeats(seats); // Hiển thị tất cả nếu không có bộ lọc
    } else {
      setFilteredSeats(
        seats.filter((seat) => selectedTypes.includes(seat.type))
      );
    }
  }, [selectedTypes]);

  const handleChange = (record, value) => {
    updateSeat(record._id, { type: value });
    setSeats((prevSeats) =>
      prevSeats.map((seat) =>
        seat._id === record._id ? { ...seat, type: value } : seat
      )
    );

    setFilteredSeats((prevSeats) =>
      prevSeats.map((seat) =>
        seat._id === record._id ? { ...seat, type: value } : seat
      )
    );
  };

  return (
    <Table
      dataSource={filteredSeats} // Hiển thị danh sách đã lọc
      rowKey="_id"
      pagination={{ pageSize: 7, showSizeChanger: false }}
      columns={[
        { title: "Name", dataIndex: "name" },
        {
          title: "Room Name",
          dataIndex: "roomId",
          render: (room) => room?.roomname,
        },
        {
          title: "Room Type",
          dataIndex: "roomId",
          render: (room) => room?.roomtype,
        },
        {
          title: "Type",
          render: (record) => (
            <Select
              defaultValue={record.type}
              style={{ width: 120 }}
              onChange={(value) => handleChange(record, value)}
              options={options}
            />
          ),
        },
      ]}
    />
  );
}
