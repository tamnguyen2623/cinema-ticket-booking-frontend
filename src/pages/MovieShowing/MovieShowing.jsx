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
  const [filterDate, setFilterDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { auth } = useContext(AuthContext)


  const handleDateChange = (date, dateString) => {
    setFilterDate(dateString);
    if (onFilter) {
      onFilter(dateString);
    }
  };
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
      setRooms(roomsRes.data.rooms || []);
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
          newMovieShowing, {
            headers: {
              Authorization: `Bearer ${auth.token}`
            }
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
          `http://localhost:8080/movieshowing/${currentMovieShowing._id}`,
          newMovieShowing, {
            headers: {
              Authorization: `Bearer ${auth.token}`
            }
          }
        );
        if (response.data.success) {
          fetchData();
        }
      }

      setIsModalVisible(false);
      form.resetFields();
    } catch (error) {
      setError('Lỗi khi xử lý suất chiếu');
      console.error('Error:', error);
      setError("Lỗi khi xử lý suất chiếu");
      console.error("Error:", error);
    }
  };

  const handleEditClick = (movieShowing) => {
    if (!movieShowing) {
      console.error("Lỗi: movieShowing là null hoặc undefined", movieShowing);
      return;
    }

    setModalType("edit");
    setCurrentMovieShowing(movieShowing);
    setIsModalVisible(true);

    form.setFieldsValue({
      movieId: movieShowing.movieId?._id || null,
      showtimeId: movieShowing.showtimeId?._id || null,
      cinemaId: movieShowing.cinemaId?._id || null,
      roomId: movieShowing.roomId?._id || null,
      date: movieShowing.date ? moment(movieShowing.date, 'YYYY-MM-DD') : null
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/movieshowing/${id}`,{
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });
      setMovieShowings((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Lỗi khi xóa suất chiếu:", error);
    }
  };

  const handleDeleteClick = (movieshowing) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Bạn có chắc chắn muốn xóa suất chiếu "${movieshowing._id}" không?`,
      okText: "Xác nhận",
      cancelText: "Hủy",
      okType: "danger",
      onOk: () => handleDelete(movieshowing._id),
    });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) return <Spin size="large" tip="Đang tải..." />;
  if (error)
    return <Alert message="Lỗi" description={error} type="error" showIcon />;

  const showModal = (showing) => {
    setCurrentMovieShowing(showing); // Lưu suất chiếu vào state
    setIsModalOpen(true); // Mở modal
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
          placeholder="Tìm kiếm suất chiếu..."
          prefix={<SearchOutlined />}
          style={{ width: 300 }}
          onChange={handleSearch}
          value={searchTerm}
        />
        <DatePicker
          format="YYYY-MM-DD"
          onChange={handleDateChange}
          placeholder="Chọn ngày"
        />
        <Button
          icon={<PlusOutlined />}
          onClick={() => {
            setModalType("add");
            setIsModalVisible(true);
          }}
        >
          Thêm Suất Chiếu
        </Button>
      </div>
      <Modal
        title={modalType === "add" ? "Thêm Suất Chiếu" : "Chỉnh Sửa Suất Chiếu"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleAddMovieShowing} layout="vertical">
          <Form.Item name="movieId" label="Phim" rules={[{ required: true }]}>
            <Select
              options={movies.map((movie) => ({
                value: movie._id,
                label: movie.name,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="showtimeId"
            label="Suất Chiếu"
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

          <Form.Item name="cinemaId" label="Rạp" rules={[{ required: true }]}>
            <Select
              options={cinemas.map((cinema) => ({
                value: cinema._id,
                label: cinema.name,
              }))}
            />
          </Form.Item>

          <Form.Item name="roomId" label="Phòng" rules={[{ required: true }]}>
            <Select
              options={rooms.map((room) => ({
                value: room._id,
                label: room.roomname,
              }))}
            />
          </Form.Item>

          <Form.Item
            label="Ngày chiếu"
            name="date"
            rules={[{ required: true }]}
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ backgroundColor: "blue", borderColor: "blue" }}
            >
              {modalType === "add" ? "Thêm Suất Chiếu" : "Lưu Thay Đổi"}
            </Button>
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
        dataSource={movieShowings.filter(
          (showing) =>
            showing.movieId?.name
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) &&
            (!filterDate || showing.date === filterDate)
        )}
        columns={[
          {
            title: "Tên Phim",
            dataIndex: "movieId",
            render: (movie) => (movie ? movie.name : "N/A"),
          },
          {
            title: "Tên Rạp",
            dataIndex: "cinemaId",
            render: (cinema) => (cinema ? cinema.name : "N/A"),
          },
          {
            title: "Tên Phòng",
            dataIndex: "roomId",
            render: (room) => (room ? room.roomname : "N/A"),
          },
          {
            title: "Ngày Chiếu",
            dataIndex: "date",
            render: (date) => (date ? formatShowtime(date).day : "N/A"),
          },
          {
            title: "Giờ Chiếu",
            dataIndex: "showtimeId",
            render: (showtime) => {
              return showtime && showtime.startTime
                ? formatShowtime(showtime.startTime).time
                : "N/A";
            },
          },
          {
            title: "Hành Động",
            render: (record) => (
              <div style={{ display: "flex", gap: "10px" }}>
                <Button
                  icon={<InsertRowAboveOutlined />}
                  onClick={() => showModal(record)}
                  className="custom-map-btn"
                >
                  Sơ đồ
                </Button>
                <Button
                  icon={<EditOutlined />}
                  onClick={() => handleEditClick(record)}
                  className="custom-edit-btn"
                >
                  Sửa
                </Button>
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeleteClick(record)}
                  className="custom-delete-btn"
                  style={{ backgroundColor: "red", color: "white" }}
                >
                  Xóa
                </Button>
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
