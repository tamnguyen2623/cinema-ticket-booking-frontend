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


  const fetchBookings = async () => {
    if (!auth?.userId) {
      setLoading(false);
      setBooking([]);
      return;
    }
    try {
      const response = await axios.get(`/egift/egift-cards/history`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
        console.log("API Response:", response.data); // Kiểm tra dữ liệu từ API 
      const bookingsData = Array.isArray(response.data.data)
        ? response.data.data
        : Array.isArray(response.data.data)
          ? response.data.data
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

  return (
    <>
      <div className="hot_movies">
        <p className="title-unique">MY SENT EGIFT CARD</p>
      </div>

      <div className="head-container">
        <div className="sub-container">
          <Row gutter={[32, 32]} justify="center">
            {bookings.length > 0 && bookings.map((ticket) => (
              <Col key={ticket._id}>
                <div className="ticket-card">
                  <div className="ticket-content">
                    {/* Ảnh phim bên trái */}
                    <div className="img-movie" style={{ width: "250px" }}>
                      <img src={ticket.egift.image} alt="Egift" />
                    </div>

                    {/* Thông tin vé bên phải */}
                    <div className="information-ticket">
                      <h3>To: {ticket.egiftRecipient.fullName}</h3>
                      <div>
                        <strong>Their email:</strong> {ticket.egiftRecipient.email}
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
                              active: "green",
                              pending: "orange",
                              inactive: "red",
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
      </div>
    </>
  );
};
export default SentEgift;
