import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  Spin,
  Alert,
  Button,
  Form,
  Input,
  DatePicker,
  Select,
  Modal,
  Switch,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  InsertRowAboveOutlined,
} from "@ant-design/icons";
import moment from "moment";
import SeatAvailable from "../../components/Seat/SeatAvailable[Admin]";
import { createSeatAvailable } from "../../components/api/seatAvailable";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";

const MovieShowingList = () => {
  const [movieShowings, setMovieShowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [movies, setMovies] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [currentMovieShowing, setCurrentMovieShowing] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { auth } = useContext(AuthContext);


  const fetchData = async () => {
    try {
      setLoading(true);
      const [moviesRes, cinemasRes, roomsRes, showtimesRes, movieShowingsRes] =
        await Promise.all([
          axios.get("http://localhost:8080/movie/"),
          axios.get("http://localhost:8080/cinema/"),
          axios.get("http://localhost:8080/room/rooms"),
          axios.get("http://localhost:8080/showtime/"),
          axios.get("http://localhost:8080/movieshowing/"),
        ]);

      setMovies(moviesRes.data.data || []);
      setCinemas(cinemasRes.data.data || []);
      const filteredRooms = (roomsRes.data.rooms || []).filter(
        (room) => room.status === false
      );
      setRooms(filteredRooms);
      setShowtimes(Array.isArray(showtimesRes.data) ? showtimesRes.data : []);
      setMovieShowings(movieShowingsRes.data.data || []);
    } catch (err) {
      setError("Lỗi khi tải dữ liệu");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatShowtime = (showtime) => {
    const date = new Date(showtime);
    return {
      day: date.toLocaleDateString(),
      time: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
  };

  const handleAddMovieShowing = async (values) => {
    try {
      const newMovieShowing = {
        movieId: values.movieId,
        showtimeId: values.showtimeId,
        cinemaId: values.cinemaId,
        roomId: values.roomId,
        date: values.date.format("YYYY-MM-DD"),
      };

      if (modalType === "add") {
        const response = await axios.post(
          "http://localhost:8080/movieshowing/",
          newMovieShowing,
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );
        if (response.data.success) {
          await createSeatAvailable({
            roomId: response.data.data.roomId,
            movieShowingId: response.data.data._id,
          });
          fetchData();
        }
      } else if (modalType === "edit") {
        const response = await axios.put(
          `http://localhost:8080/movieshowing/${currentMovieShowing._id}`, newMovieShowing,
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );
        console.log("Update Response:", response.data);
        if (response.data.success) {
          console.log(response.data);
          fetchData();
        }
      }
      setIsModalVisible(false);
      form.resetFields();
      toast.success("Movie Showing updated status successfully!");
    } catch (error) {
      toast.setError("Lỗi khi xử lý suất chiếu");
      console.error("Error:", error);
      toast.setError("Lỗi khi xử lý suất chiếu");
      console.error("Error:", error);
    }
  };

  const handleEditClick = (movieShowing) => {
    setModalType("edit");
    setCurrentMovieShowing(movieShowing);
    setIsModalVisible(true);
    form.setFieldsValue({
      movieId: movieShowing.movieId?._id || null,
      showtimeId: movieShowing.showtimeId?._id || null,
      cinemaId: movieShowing.cinemaId?._id || null,
      roomId: movieShowing.roomId?._id || null,
      date: movieShowing.date ? moment(movieShowing.date, "YYYY-MM-DD") : null,
    });
  };


  const handleToggleDelete = async (id, isDelete) => {
    try {
      await axios.put(
        `http://localhost:8080/movieshowing/${id}/active`,
        { isDelete: !isDelete },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      setMovieShowings((prev) =>
        prev.map((showing) =>
          showing._id === id ? { ...showing, isDelete: !isDelete } : showing
        )
      );

      toast.success("Cập nhật trạng thái thành công!");
    } catch (error) {
      toast.error("Lỗi khi cập nhật trạng thái!");
    }
  };




  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) return <Spin size="large" tip="Đang tải..." />;
  if (error)
    return <Alert message="Lỗi" description={error} type="error" showIcon />;

  const showModal = (showing) => {
    setCurrentMovieShowing(showing);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="content">
      <div style={{ display: "flex", gap: "10px", marginBottom: 16 }}>
        <Input
          placeholder="Search for movie showing..."
          prefix={<SearchOutlined />}
          style={{ width: 300 }}
          onChange={handleSearch}
          value={searchTerm}
        />
        <Button
          icon={<PlusOutlined />}
          onClick={() => {
            setModalType("add");
            setIsModalVisible(true);
          }}
        >
          Add Movie Showing
        </Button>
      </div>
      <Modal
        title={modalType === "add" ? "Add Movie Showing" : "Edit Movie Showing"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={() => form.submit()}
            style={{ backgroundColor: "blue", borderColor: "blue" }}
          >
            Save
          </Button>,
        ]}
      >
        <Form form={form} onFinish={handleAddMovieShowing} layout="vertical">
          <Form.Item name="movieId" label="Movie" rules={[{ required: true }]}>
            <Select
              options={movies.map((movie) => ({
                value: movie._id,
                label: movie.name,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="showtimeId"
            label="Showtime"
            rules={[{ required: true }]}
          >
            <Select
              options={showtimes.map((showtime) => ({
                value: showtime._id,
                label: new Date(showtime.startTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              }))}
            />
          </Form.Item>

          <Form.Item name="cinemaId" label="Cinema" rules={[{ required: true }]}>
            <Select
              options={cinemas.map((cinema) => ({
                value: cinema._id,
                label: cinema.name,
              }))}
            />
          </Form.Item>

          <Form.Item name="roomId" label="Room" rules={[{ required: true }]}>
            <Select
              options={rooms.map((room) => ({
                value: room._id,
                label: room.roomname,
              }))}
            />
          </Form.Item>

          <Form.Item label="Show Date" name="date" rules={[{ required: true }]}>
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
        </Form>
      </Modal>


      <Modal
        title="Seat Map"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okType={"default"}
        style={{ marginLeft: "350px" }}
        width={1000}
      >
        <SeatAvailable movieShowing={currentMovieShowing} />
      </Modal>

      <Table
        dataSource={movieShowings}
        columns={[
          {
            title: "Movie Name",
            dataIndex: "movieId",
            render: (movie) => (movie ? movie.name : "N/A"),
          },
          {
            title: "Cinema Name",
            dataIndex: "cinemaId",
            render: (cinema) => (cinema ? cinema.name : "N/A"),
          },
          {
            title: "Room Name",
            dataIndex: "roomId",
            render: (room) => (room ? room.roomname : "N/A"),
          },
          {
            title: "Show Date",
            dataIndex: "date",
            render: (date) => (date ? formatShowtime(date).day : "N/A"),
          },
          {
            title: "Showtime",
            dataIndex: "showtimeId",
            render: (showtime) => {
              return showtime && showtime.startTime
                ? formatShowtime(showtime.startTime).time
                : "N/A";
            },
          },
          {
            title: "Action",
            render: (record) => (
              <div style={{ display: "flex", gap: "10px" }}>
                <Button
                  icon={<InsertRowAboveOutlined />}
                  onClick={() => showModal(record)}
                  className="custom-map-btn"
                >
                  Map
                </Button>
                <Button
                  icon={<EditOutlined />}
                  onClick={() => handleEditClick(record)}
                  className="custom-edit-btn"
                >
                  Edit
                </Button>
              </div>
            ),
          },
          {
            title: "Disabled",
            key: "disabled",
            render: (record) => (
              <div style={{ display: "flex", gap: "10px" }}>
                <Switch
                  checked={record.isDelete}
                  className="custom-switch"
                  onChange={() => handleToggleDelete(record._id, record.isDelete)}
                />
              </div>
            ),
          },
        ]}
        rowKey="_id"
      />
    </div>
  );
};

export default MovieShowingList;