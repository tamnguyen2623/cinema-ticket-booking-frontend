import React, { useState, useEffect, useContext } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  notification,
  Spin,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import "../components/styles/roomStyle.css";
import {
  fetchCinemas,
  fetchRooms,
  createOrUpdateRoom,
  deleteRoom,
} from "../components/api/roomApi";
const { Option } = Select;

const Room = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cinemas, setCinemas] = useState([]);
  const [loadingCinemas, setLoadingCinemas] = useState(true);
  const [rooms, setRooms] = useState([]);
  const { auth } = useContext(AuthContext);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCinema, setSelectedCinema] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const cinemasData = await fetchCinemas();
        setCinemas(cinemasData);
        const roomsData = await fetchRooms(auth.token);
        setRooms(roomsData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingCinemas(false);
      }
    };
    loadData();
  }, [auth.token]);

  const onFinish = async (values) => {
    console.log("Form Values Submitted:", values);
    setIsSubmitting(true);

    if (!auth.token) {
      notification.error({
        message: "Unauthorized",
        description: "You are not authorized to create or update a room.",
      });
      return;
    }

    try {
      const roomData = await createOrUpdateRoom(
        auth.token,
        values,
        editingRoom
      );
      const cinemaName =
        cinemas.find((cinema) => cinema._id === values.cinema)?.name ||
        "Unknown Cinema";

      setRooms((prevRooms) => {
        if (editingRoom) {
          return prevRooms.map((room) =>
            room._id === editingRoom._id
              ? {
                  ...roomData,
                  cinema: { _id: values.cinema, name: cinemaName },
                }
              : room
          );
        }
        return [
          ...prevRooms,
          { ...roomData, cinema: { _id: values.cinema, name: cinemaName } },
        ];
      });

      setIsFormVisible(false);
      setEditingRoom(null);
    } catch (error) {
      console.error("Error creating/updating room:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (roomId) => {
    if (!auth.token) {
      notification.error({
        message: "Unauthorized",
        description: "You are not authorized to delete a room.",
      });
      return;
    }

    try {
      await deleteRoom(auth.token, roomId);
      setRooms((prevRooms) => prevRooms.filter((room) => room._id !== roomId));
      notification.success({
        message: "Room deleted successfully!",
        description: "The room has been deleted.",
      });
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  };

  const filteredRooms = rooms.filter((room) => {
    const matchesSearchTerm = room.roomname
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCinema = !selectedCinema || room.cinema._id === selectedCinema;

    return matchesSearchTerm && matchesCinema;
  });

  const columns = [
    {
      title: "Room Name",
      dataIndex: "roomname",
      key: "roomname",
    },
    {
      title: "Cinema",
      dataIndex: "cinema",
      key: "cinema",
      render: (cinema) => (cinema ? cinema.name : "N/A"),
    },
    {
      title: "Type",
      dataIndex: "roomtype",
      key: "roomtype",
    },
    {
      title: "Seats",
      dataIndex: "seatnumber",
      key: "seatnumber",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div>
          <Button
            type="primary"
            size="small"
            onClick={() => {
              setEditingRoom(record);
              setIsFormVisible(true);
            }}
            style={{
              marginRight: "8px",
              backgroundColor: "#0000FF",
              borderColor: "#0000FF",
            }}
          >
            <EditOutlined style={{ marginRight: "5px" }} />
            Edit
          </Button>
          <Button
            type="danger"
            size="small"
            onClick={() => handleDelete(record._id)}
            style={{ backgroundColor: "#ff0000", borderColor: "ff0000" }}
          >
            <DeleteOutlined style={{ marginRight: "5px" }} />
            Delete
          </Button>
        </div>
      ),
    },
  ];
  return (
    <div className="container-fluid">
      <Navbar />
      <div className="container_content">
        <h2 className="roomHeader">Rooms List</h2>

        <div className="searchFilterCreactContainer">
          <div className="searchFilterContainer">
            <Input
              placeholder="Search by Room Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="searchInput"
            />
            <Select
              placeholder="Filter by Cinema"
              value={selectedCinema}
              onChange={setSelectedCinema}
              className="filterSelect"
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
            block
            className="createRoomButton"
            onClick={() => setIsFormVisible(true)}
          >
            Create Room
          </Button>
        </div>

        <Table
          dataSource={filteredRooms}
          columns={columns}
          rowKey="_id"
          pagination={{ pageSize: 5 }}
          className="table"
        />

        <Modal
          title={editingRoom ? "Edit Room" : "Create Room"}
          visible={isFormVisible}
          onCancel={() => {
            setIsFormVisible(false);
            setEditingRoom(null);
          }}
          footer={null}
          width="80%"
        >
          <Form
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              cinema: editingRoom?.cinema?._id,
              roomname: editingRoom?.roomname,
              roomtype: editingRoom?.roomtype,
              seatnumber: editingRoom?.seatnumber,
            }}
          >
            <Form.Item
              name="cinema"
              label="Cinema"
              rules={[{ required: true, message: "Cinema is required" }]}
            >
              {loadingCinemas ? (
                <Spin size="small" />
              ) : (
                <Select placeholder="Select Cinema" disabled={!!editingRoom}>
                  {cinemas.map((cinema) => (
                    <Option key={cinema._id} value={cinema._id}>
                      {cinema.name}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>

            <Form.Item
              name="roomname"
              label="Room Name"
              rules={[{ required: true, message: "Room Name is required" }]}
            >
              <Input placeholder="Enter Room Name" />
            </Form.Item>

            <Form.Item
              name="roomtype"
              label="Room Type"
              rules={[{ required: true, message: "Room Type is required" }]}
            >
              <Select placeholder="Select Room Type">
                <Option value="Regular">Regular </Option>
                <Option value="Premium">Premium </Option>
                <Option value="VIP">VIP</Option>
                <Option value="Luxury">7D</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="seatnumber"
              label="Number of Seats"
              rules={[
                { required: true, message: "Number of Seats is required" },
                {
                  min: 1,
                  max: 300,
                  message: "Seat number must be between 1 and 300",
                },
              ]}
            >
              <Input
                type="number"
                placeholder="Enter Seat Number"
                min={1}
                max={300}
              />
            </Form.Item>

            <div className="modalFooter">
              <Button
                onClick={() => setIsFormVisible(false)}
                style={{ marginRight: 8 }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={isSubmitting}
                disabled={isSubmitting}
                className="saveChangesButton"
              >
                {editingRoom ? "Save Changes" : "Create Room"}
              </Button>
            </div>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Room;
