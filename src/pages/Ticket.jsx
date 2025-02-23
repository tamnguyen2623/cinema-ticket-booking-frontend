import React, { useState, useEffect, useContext } from "react";
import { Table, Button, Modal, Form, Input, notification, Select } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { AuthContext } from "../context/AuthContext";
import "../components/styles/roomStyle.css";
import {
  fetchRooms,
  fetchTicket,
  createOrUpdateTicket,
  deleteTicket,
  DetailTicket,
} from "../components/api/ticketApi";

const Ticket = () => {
  const { auth } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [editingTicket, setEditingTicket] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [ticketDetail, setTicketDetail] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  useEffect(() => {
    const fetchDataRoom = async () => {
      try {
        const fetchedRooms = await fetchRooms(auth.token);
        setRooms(fetchedRooms);
        const fetchedTickets = await fetchTicket(auth.token);
        setTickets(fetchedTickets);
        setFilteredTickets(fetchedTickets);
      } catch (error) {
        notification.error({
          message: "Error",
          description: error.message,
          duration: 2,
        });
      }
    };
    fetchDataRoom();
  }, [auth.token]);

  const fetchTickets = async () => {
    try {
      const fetchedTickets = await fetchTicket(auth.token);
      setTickets(fetchedTickets);
      setFilteredTickets(fetchedTickets);
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.message,
        duration: 2,
      });
    }
  };

  useEffect(() => {
    let filteredData = tickets;

    if (searchTerm) {
      filteredData = filteredData.filter(
        (ticket) =>
          ticket.roomType.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ticket.seatType.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filter !== "all") {
      filteredData = filteredData.filter(
        (ticket) => ticket.roomType === filter
      );
    }

    setFilteredTickets(filteredData);
  }, [searchTerm, filter, tickets]);

  const showModal = (ticket) => {
    if (ticket) {
      form.setFieldsValue(ticket);
      setEditingTicket(ticket);
    } else {
      setEditingTicket(null);
    }
    setIsModalVisible(true);
  };

  const handleCreateOrUpdateTicket = async () => {
    try {
      const values = await form.validateFields();
      await createOrUpdateTicket(auth.token, values, editingTicket);
      notification.success({
        message: editingTicket ? "Ticket updated" : "Ticket created",
        description: "The ticket has been successfully saved.",
        duration: 2,
      });
      setIsModalVisible(false);
      setEditingTicket(null);
      fetchTickets();
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.message,
        duration: 2,
      });
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingTicket(null);
  };

  const handleDelete = async (ticketId) => {
    try {
      await deleteTicket(auth.token, ticketId);
      notification.success({
        message: "Ticket deleted",
        description: "The ticket has been successfully deleted.",
        duration: 2,
      });
      fetchTickets();
    } catch (error) {
      notification.error({
        message: "Error",
        description: error.message,
        duration: 2,
      });
    }
  };

  const showDetailModal = async (roomId) => {
    if (!auth.token) {
      notification.error({
        message: "Unauthorized",
        description: "You are not authorized to view room details.",
        duration: 2,
      });
      return;
    }

    try {
      const detail = await DetailTicket(auth.token, roomId);
      console.log("object detail", detail);
      setTicketDetail(detail);
      setIsDetailModalVisible(true);
      notification.success({
        message: "Room details loaded successfully!",
        duration: 2,
      });
    } catch (error) {
      console.error("Error fetching room details:", error);
      notification.error({
        message: "Failed to load room details",
        description:
          error.message || "An error occurred while fetching details.",
        duration: 2,
      });
    }
  };

  const columns = [
    {
      title: "Room Type",
      dataIndex: "roomType",
      key: "roomType",
    },
    {
      title: "Seat Type",
      dataIndex: "seatType",
      key: "seatType",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <>
          <Button
            icon={<InfoCircleOutlined />}
            onClick={() => showDetailModal(record._id)}
            style={{
              marginRight: "8px",
              backgroundColor: "#1acc3b",
              marginRight: "5px",
              color: "white",
            }}
          ></Button>
          <Button
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
            style={{
              marginRight: "8px",
              backgroundColor: "#0000FF",
              borderColor: "#0000FF",
              marginRight: "5px",
              color: "white",
            }}
          />
          <Button
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
            style={{
              backgroundColor: "#ff0000",
              borderColor: "ff0000",
              color: "white",
            }}
          />
        </>
      ),
    },
  ];

  return (
    <div className="container-fluid">
      <div className="container_content">
        <h2 className="roomHeader">Tickets List</h2>
        <div className="searchFilterCreactContainer">
          <div className="searchFilterContainer">
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
              {rooms.map((room) => (
                <Select.Option key={room._id} value={room.roomname}>
                  {room.roomname}
                </Select.Option>
              ))}
            </Select>
          </div>
          <Button
            type="primary"
            icon={<PlusOutlined style={{ color: "white" }} />}
            onClick={() => showModal(null)}
            className="createRoomButton"
            style={{ marginBottom: 16 }}
          >
            Add new
          </Button>
        </div>
        <Table
          className="table"
          columns={columns}
          dataSource={filteredTickets}
          rowKey="_id"
        />

        <Modal
          title="Ticket Detail"
          visible={isDetailModalVisible}
          onCancel={() => setIsDetailModalVisible(false)}
          footer={null}
          width="80%"
        >
          {ticketDetail ? (
            <div>
              <p>
                <strong>Room Type:</strong> {ticketDetail.roomType}
              </p>
              <p>
                <strong>Seat Type:</strong> {ticketDetail.seatType}
              </p>
              <p>
                <strong>Price:</strong> {ticketDetail.price}
              </p>
              <p>
                <strong>CreactAt:</strong> {ticketDetail.createdAt}
              </p>
              <p>
                <strong>UpdatedAt :</strong> {ticketDetail.updatedAt}
              </p>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </Modal>

        <Modal
          title={editingTicket ? "Edit Ticket" : "Create Ticket"}
          visible={isModalVisible}
          onOk={handleCreateOrUpdateTicket}
          okButtonProps={{
            style: {
              backgroundColor: "#0000FF",
              borderColor: "#0000FF",
              color: "white",
            },
          }}
          onCancel={handleCancel}
        >
          <Form form={form} layout="vertical" name="ticketForm">
            <Form.Item
              name="roomType"
              label="Room Type"
              rules={[{ required: true, message: "Please select a room type" }]}
            >
              <Select>
                {rooms.map((room) => (
                  <Select.Option key={room._id} value={room.roomtype}>
                    {room.roomtype}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="seatType"
              label="Seat Type"
              rules={[{ required: true, message: "Please select a seat type" }]}
            >
              <Select>
                <Select.Option value="Standard">Standard</Select.Option>
                <Select.Option value="VIP">VIP</Select.Option>
                <Select.Option value="Premium">Premium</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="price"
              label="Price"
              rules={[
                { required: true, message: "Number of Seats is required" },
                {
                  min: 1,
                  max: 300,
                  message: "Seat number must be between 1 and 300",
                },
              ]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Ticket;
