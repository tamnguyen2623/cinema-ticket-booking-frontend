import React from "react";
import { Table, Button, Input, Select, Switch } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import "../../components/styles/ticketStyle.css";
import { handleToggleIsDelete } from "./TicketActions";

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
  auth,
  fetchTickets,
}) => {
  const filterroomtype = [...new Set(rooms?.map((room) => room.roomtype))];
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
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
            className="actionButton editButton"
          >
            Update
          </Button>

          <Button
            icon={<InfoCircleOutlined />}
            onClick={() => showDetailModal(record._id)}
            className="actionButton infoButton"
          >
            Detail
          </Button>

          {/* <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
            className="actionButton deleteButton"
          /> */}
        </>
      ),
    },
    {
      title: "Disabled",
      key: "disabled",
      render: (record) => (
        <Switch
          checked={record.isDelete}
          className="custom-switch"
          onChange={(checked) =>
            handleToggleIsDelete(auth, record._id, checked, fetchTickets)
          }
        />
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
            {filterroomtype.map((roomtype, index) => (
              <Select.Option key={index} value={roomtype}>
                {roomtype}
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