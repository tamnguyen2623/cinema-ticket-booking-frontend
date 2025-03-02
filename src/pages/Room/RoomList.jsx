import React, { useState, useEffect, useMemo } from "react";
import { Table, Button, Input, Select, Switch } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import "../../components/styles/RoomList.css";
import { handleToggleStatus } from "./RoomActions";

const { Option } = Select;

const RoomList = ({
  rooms,
  setRooms, // ✅ Thêm setRooms
  handleEdit,
  handleDelete,
  handleDetail,
  cinemas,
  handleAddRoom,
  auth, // ✅ Thêm auth
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCinema, setSelectedCinema] = useState("");

  const filteredRooms = useMemo(() => {
    return rooms.filter(
      (room) =>
        room.roomname.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedCinema ? room.cinema._id === selectedCinema : true)
    );
  }, [rooms, searchTerm, selectedCinema]);

  const columns = [
    { title: "Room Name", dataIndex: "roomname", key: "roomname" },
    {
      title: "Cinema",
      dataIndex: "cinema",
      key: "cinema",
      render: (cinema) => cinema?.name || "N/A",
    },
    { title: "Type", dataIndex: "roomtype", key: "roomtype" },
    { title: "Row", dataIndex: "row", key: "row" },
    { title: "Column", dataIndex: "colum", key: "colum" },
    {
      title: "Actions",
      key: "actions",
      render: (record) => (
        <div className="action-buttons">
          <Button
            icon={<EditOutlined />}
            type="primary"
            size="small"
            onClick={() => handleEdit(record)}
            className="edit-btn"
          >
            Update
          </Button>
          <Button
            icon={<InfoCircleOutlined />}
            type="primary"
            size="small"
            onClick={() => handleDetail(record._id)}
            className="info-btn"
          >
            Detail
          </Button>

          {/* <Button
            type="danger"
            size="small"
            onClick={() => handleDelete(record._id)}
            className="delete-btn"
          >
            <DeleteOutlined />
          </Button> */}
        </div>
      ),
    },
    {
      title: "Disabled",
      key: "disabled",
      render: (record) => (
        <Switch
          checked={record.status}
          className="custom-switch"
          onChange={(checked) =>
            handleToggleStatus(auth.token, record._id, checked, setRooms)
          }
        />
      ),
    },
  ];

  return (
    <div className="container">
      <div className="title-list">Rooms List</div>
      <div className="search-filter-add-container">
        <div className="search-filter-container">
          <Input
            placeholder="Search by Room Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <Select
            placeholder="Filter by Cinema"
            value={selectedCinema}
            onChange={(value) => setSelectedCinema(value)}
            className="filter-select"
          >
            <Option value="">All Cinemas</Option>
            {cinemas.map((cinema) => (
              <Option key={cinema._id} value={cinema._id}>
                {cinema.name}
              </Option>
            ))}
          </Select>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddRoom}
          className="add-room-button"
        >
          Add Room
        </Button>
      </div>
      <Table
        className="room-table"
        dataSource={filteredRooms}
        columns={columns}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default RoomList;
