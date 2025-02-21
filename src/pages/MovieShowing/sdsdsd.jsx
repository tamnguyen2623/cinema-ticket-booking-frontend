import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Spin, Alert, Button, Form, Input, DatePicker, Select, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import moment from 'moment';

const MovieShowingList = () => {
  const [movieShowings, setMovieShowings] = useState([]);
  const [filteredShowings, setFilteredShowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [form] = Form.useForm();
  const [movies, setMovies] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [showtimes, setShowtimes] = useState([]);
  const [currentMovieShowing, setCurrentMovieShowing] = useState(null);
  const [modalType, setModalType] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [moviesRes, cinemasRes, roomsRes, showtimesRes, movieShowingsRes] = await Promise.all([
        axios.get('http://localhost:8080/movie/'),
        axios.get('http://localhost:8080/cinema/'),
        axios.get('http://localhost:8080/room/rooms'),
        axios.get('http://localhost:8080/showtime/'),
        axios.get('http://localhost:8080/movieshowing/')
      ]);

      setMovies(moviesRes.data.data || []);
      setCinemas(cinemasRes.data.data || []);
      setRooms(roomsRes.data.rooms || []);
      setShowtimes(Array.isArray(showtimesRes.data) ? showtimesRes.data : []);
      setMovieShowings(movieShowingsRes.data.data || []);
      setFilteredShowings(movieShowingsRes.data.data || []);

    } catch (err) {
      setError('Lỗi khi tải dữ liệu');
      console.error('Error fetching data:', err);
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
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  };


  useEffect(() => {
    let filtered = movieShowings;

    if (searchTerm) {
      filtered = filtered.filter((showing) =>
        showing.movieId?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDate) {
      const formattedDate = selectedDate.format("YYYY-MM-DD");
      filtered = filtered.filter((showing) => showing.date === formattedDate);
    }

    setFilteredShowings(filtered);
  }, [searchTerm, selectedDate, movieShowings]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  if (loading) return <Spin size="large" tip="Đang tải..." />;
  if (error) return <Alert message="Lỗi" description={error} type="error" showIcon />;

  return (
    <div className='content'>
      <div style={{ display: "flex", gap: "10px", marginBottom: 16 }}>
        <Input
          placeholder="Tìm kiếm suất chiếu..."
          prefix={<SearchOutlined />}
          style={{ width: 300 }}
          value={searchTerm}
          onChange={handleSearch}
        />
        <DatePicker
          format="YYYY-MM-DD"
          onChange={handleDateChange}
          placeholder="Chọn ngày"
        />
        <Button icon={<PlusOutlined />} onClick={() => { setModalType("add"); setIsModalVisible(true); }}>
          Thêm Suất Chiếu
        </Button>
      </div>

      <Table
        dataSource={filteredShowings}
        columns={[
          {
            title: 'Tên Phim',
            dataIndex: 'movieId',
            render: (movie) => movie ? movie.name : 'N/A',
          },
          {
            title: 'Tên Rạp',
            dataIndex: 'cinemaId',
            render: (cinema) => cinema ? cinema.name : 'N/A',
          },
          {
            title: 'Tên Phòng',
            dataIndex: 'roomId',
            render: (room) => room ? room.roomname : 'N/A',
          },
          {
            title: 'Ngày Chiếu',
            dataIndex: 'date',
            render: (date) => date ? formatShowtime(date).day : 'N/A',
          },
          {
            title: 'Giờ Chiếu',
            dataIndex: 'showtimeId',
            render: (showtime) => {
              return showtime && showtime.startTime
                ? formatShowtime(showtime.startTime).time
                : 'N/A';
            }
          },
          {
            title: "Hành Động",
            render: (record) => (
              <div style={{ display: "flex", gap: "10px" }}>
                <Button icon={<EditOutlined />} onClick={() => handleEditClick(record)} className="custom-edit-btn">Sửa</Button>
                <Button danger icon={<DeleteOutlined />} onClick={() => handleDeleteClick(record)} className="custom-delete-btn" style={{ backgroundColor: 'red', color: 'white' }}>Xóa</Button>
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
