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
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import "../components/styles/roomStyle.css";
import {
  fetchCinemas,
  fetchRooms,
  createOrUpdateRoom,
  deleteRoom,
  DetailRoom,
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
  const [roomDetail, setRoomDetail] = useState([]);
  const [isFormDetailVisible, setIsFormDetailVisible] = useState(false);
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
        duration: 2,
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
        duration: 2,
      });
      return;
    }

    try {
      await deleteRoom(auth.token, roomId);
      setRooms((prevRooms) => prevRooms.filter((room) => room._id !== roomId));
      notification.success({
        message: "Room deleted successfully!",
        description: "The room has been deleted.",
        duration: 2,
      });
    } catch (error) {
      console.error("Error deleting room:", error);
    }
  };

  const handleDetail = async (roomId) => {
    if (!auth.token) {
      notification.error({
        message: "Unauthorized",
        description: "You are not authorized to view room details.",
        duration: 2,
      });
      return;
    }

    try {
      const detail = await DetailRoom(auth.token, roomId);
      console.log("room", detail.room.roomname);
      setRoomDetail(detail);
      setIsFormDetailVisible(true);
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
      title: "Row Number",
      dataIndex: "row",
      key: "row",
    },
    {
      title: "Colum Number",
      dataIndex: "colum",
      key: "colum",
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
              handleDetail(record._id);
            }}
            style={{
              marginRight: "8px",
              backgroundColor: "#1acc3b",
              borderColor: "#1acc3b",
              marginRight: "5px",
              color: "white",
            }}
          >
            <InfoCircleOutlined />
          </Button>
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
              marginRight: "5px",
              color: "white",
            }}
          >
            <EditOutlined />
          </Button>
          <Button
            type="danger"
            size="small"
            onClick={() => handleDelete(record._id)}
            style={{
              backgroundColor: "#ff0000",
              borderColor: "ff0000",
              color: "white",
            }}
          >
            <DeleteOutlined />
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
            icon={<PlusOutlined style={{ color: "white" }} />}
            type="primary"
            block
            className="createRoomButton"
            onClick={() => setIsFormVisible(true)}
          >
            Add room
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
          title={
            roomDetail
              ? "Room Details"
              : editingRoom
              ? "Edit Room"
              : "Create Room"
          }
          visible={isFormVisible || isFormDetailVisible}
          onCancel={() => {
            setIsFormVisible(false);
            setIsFormDetailVisible(false);
            setEditingRoom(null);
            setRoomDetail(null);
          }}
          footer={null}
          width="80%"
        >
          {roomDetail ? (
            <div>
              <p>
                <strong>Room Name:</strong> {roomDetail.room?.roomname}
              </p>
              <p>
                <strong>Cinema:</strong> {roomDetail.room?.cinema?.name}
              </p>
              <p>
                <strong>Type:</strong> {roomDetail.room?.roomtype}
              </p>
              <p>
                <strong>row:</strong> {roomDetail.room?.row}
              </p>
              <p>
                <strong>colum:</strong> {roomDetail.room?.colum}
              </p>
              <p>
                <strong>CreactAt:</strong> {roomDetail.room?.createdAt}
              </p>
              <p>
                <strong>UpdateAt:</strong> {roomDetail.room?.updatedAt}
              </p>
            </div>
          ) : (
            <Form
              layout="vertical"
              onFinish={onFinish}
              initialValues={{
                cinema: editingRoom?.cinema?._id,
                roomname: editingRoom?.roomname,
                roomtype: editingRoom?.roomtype,
                row: editingRoom?.row,
                colum: editingRoom?.colum,
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
                  <Option value="Standard">Standard</Option>
                  <Option value="IMAX">IMAX</Option>
                  <Option value="4DX">4DX</Option>
                  <Option value="Dolby">Dolby</Option>
                  <Option value="ScreenX">ScreenX</Option>
                  <Option value="Private">ScreenX</Option>
                </Select>
              </Form.Item>

              <Form.Item
                name="row"
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

              <Form.Item
                name="colum"
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
          )}
        </Modal>
      </div>
    </div>
  );
};

export default Room;
