import React from "react";
import { Table, Button, Input, Select } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import "../../components/styles/ticketStyle.css";

const TicketList = ({
  tickets,
  showDetailModal,
  showModal,
  handleDelete,
  searchTerm,
  setSearchTerm,
  filter,
  setFilter,
  rooms,
}) => {
  const columns = [
    { title: "Room Type", dataIndex: "roomType", key: "roomType" },
    { title: "Seat Type", dataIndex: "seatType", key: "seatType" },
    { title: "Price", dataIndex: "price", key: "price" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            icon={<InfoCircleOutlined />}
            onClick={() => showDetailModal(record._id)}
            className="actionButton infoButton"
          />
          <Button
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
            className="actionButton editButton"
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
            className="actionButton deleteButton"
          />
        </>
      ),
    },
  ];

  return (
    <div className="ticketListContainer">
      <div className="searchFilterContainer">
        <div>
          <Input
            className="searchInput"
            placeholder="Search by room or seat type"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select
            className="filterSelect"
            value={filter}
            onChange={(value) => setFilter(value)}
          >
            <Select.Option value="all">All Room Types</Select.Option>
            {rooms?.map((room, index) => (
              <Select.Option key={index} value={room.roomtype}>
                {room.roomtype}
              </Select.Option>
            ))}
          </Select>
        </div>
        <div className="buttonAddContainer">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showModal(null)}
            className="addTicketButton"
          >
            Add Ticket
          </Button>
        </div>
      </div>
      <Table columns={columns} dataSource={tickets} rowKey="_id" />
    </div>
  );
};

export default TicketList;
