import React, { useContext, useEffect, useState } from "react";
import {
  Card,
  Spin,
  Alert,
  Tag,
  Typography,
  Row,
  Col,
  Modal,
  Button,
  DatePicker,
  Select,
} from "antd";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
// import "./MyTicket.css";
import { EditOutlined, EyeOutlined } from "@ant-design/icons";
import FeedbackForm from "../../components/Feedback/FeedbackForm";
import FeedbackDetail from "../../components/Feedback/FeedbackDetail";
import { Height } from "@mui/icons-material";
import { height } from "@mui/system";

// import { QRCode, QRCodeSVG } from "qrcode.react";
const { Title } = Typography;
// import "./MyTicket.css";

const SentEgift = () => {
  const { auth } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  {
    /* nga them */
  }
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(null);
  const navigate = useNavigate();
  const [addModal, setAddModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [booking, setBooking] = useState();
  const [refresh, setRefresh] = useState(false);

  const showModal = (booking) => {
    setBooking(booking); // Lưu suất chiếu vào state
    if (booking.isFeedback) {
      setViewModal(true);
      return;
    }
    setAddModal(true); // Mở modal
  };

  const handleCancelAddModal = () => {
    setAddModal(false);
    setRefresh(!refresh);
  };

  const handleCancelViewModal = () => {
    setViewModal(false);
  };
  {
    /* nga them */
  }
  const now = dayjs(); // Lấy thời gian hiện tại
  const today = dayjs().startOf("day"); // Lấy ngày hiện tại (YYYY-MM-DD)
  const filteredBookings = bookings.filter((ticket) => {
    const ticketDate = dayjs(ticket.date).startOf("day");
    const ticketTime = dayjs(ticket.showtime);
    // const formattedShowtime = new Date(ticket.showtime).toLocaleTimeString(
    //   "en-US",
    //   {
    //     hour: "2-digit",
    //     minute: "2-digit",
    //     hour12: true,
    //   }
    // );
    if (
      selectedDate &&
      dayjs(ticket.date).format("DD/MM/YYYY") !== selectedDate
    ) {
      return false;
    }
    if (
      selectedFilter === "watched" &&
      (ticketDate.isBefore(today) ||
        (ticketDate.isSame(today) && ticketTime.isBefore(now)))
    ) {
      return true;
    }
    if (
      selectedFilter === "unwatched" &&
      (ticketDate.isAfter(today) ||
        (ticketDate.isSame(today) && ticketTime.isAfter(now)))
    ) {
      return true;
    }
    return selectedFilter === "all";
  });

  const fetchBookings = async () => {
    if (!auth?.userId) {
      setLoading(false);
      setBooking([]);
      return;
    }
    try {
      const response = await axios.get(`/booking/booking/user/${auth.userId}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      const bookingsData = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data.bookings)
          ? response.data.bookings
          : [];
      console.log(bookingsData);

      setBookings(bookingsData);
    } catch (err) {
      setError("Lỗi khi tải danh sách vé.");
      setBookings([]); // Đảm bảo rằng bookings là rỗng khi có lỗi
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [auth.userId]);

  if (loading)
    return (
      <Spin
        tip="Đang tải danh sách vé..."
        className="w-full flex justify-center"
      />
    );
  console.log("booking", bookings);

  if (!filteredBookings || filteredBookings.length === 0 || error) {
    return (
      <div>
        <div className="hot_movies">
          <p className="title-unique">MY TICKETS</p>
        </div>
        <div className="filter-container">
          <DatePicker
            className="custom-datepicker"
            onChange={(date, dateString) => setSelectedDate(dateString)}
            format="DD/MM/YYYY"
            placeholder="Selected day"
            allowClear
          />
          <Select
            className="custom-select"
            value={selectedFilter}
            onChange={(value) => setSelectedFilter(value)}
          >
            <Select.Option value="all">All Ticket</Select.Option>
            <Select.Option value="watched">Watched</Select.Option>
            <Select.Option value="unwatched">Unwatched</Select.Option>
          </Select>
        </div>

        <Alert message="Not find." type="info" showIcon />
      </div>
    );
  }

  return (
    <>
      <div className="hot_movies">
        <p className="title-unique">MY SENT EGIFT CARD</p>
      </div>

      <div className="head-container">
        <div className="sub-container">
          <Row gutter={[32, 32]} justify="center">
            {filteredBookings.map((ticket) => (
              <Col key={ticket._id}>
                <div className="ticket-card">
                  <div className="ticket-content">
                    {/* Ảnh phim bên trái */}
                    <div className="img-movie" style={{ width: "250px" }}>
                      <img src={ticket.image} alt="Egift" />
                    </div>

                    {/* Thông tin vé bên phải */}
                    <div className="information-ticket">
                      <h3>To: {ticket.fullName}</h3>
                      <div>
                        <strong>Their email:</strong> {ticket.email}
                      </div>
                      <div>
                        <strong>Balance:</strong> {ticket.balance} $
                      </div>
                      <div>
                        <strong>Card number:</strong> {ticket.cardNumber}
                      </div>
                      <div>
                        <strong>PIN: </strong> {ticket.pin}
                      </div>

                      <div className="flex items-center justify-between pr-5">
                        <Tag
                          color={
                            {
                              success: "green",
                              pending: "orange",
                              failed: "red",
                              cancelled: "volcano",
                            }[ticket.status]
                          }
                        >
                          {ticket.status.toUpperCase()}
                        </Tag>


                      </div>

                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
        <Modal
          title={`Ratting & Feedback "${booking?.movieName}"`}
          open={addModal}
          onCancel={handleCancelAddModal}
          width={1000}
          footer={null}
        >
          <FeedbackForm
            userId={auth.userId}
            form={"Add"}
            booking={booking}
            setModal={setAddModal}
            fetchBookings={fetchBookings}
            handleCancelModal={handleCancelAddModal}
            setRefresh={setRefresh}
            refresh={refresh}
          />
        </Modal>

        <Modal
          title={`View feedback "${booking?.movieName}"`}
          open={viewModal}
          onCancel={handleCancelViewModal}
          width={1000}
          footer={null}
        >
          <FeedbackDetail
            userId={auth.userId}
            booking={booking}
            // setModal={setViewModal}
            fetchBookings={fetchBookings}
            handleCancelViewModal={handleCancelViewModal}
          />
        </Modal>
      </div>
    </>
  );
};
export default SentEgift;
