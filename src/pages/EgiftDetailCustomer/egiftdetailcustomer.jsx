import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { IconButton } from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import "./egiftdetailcustomer.css";
import FloatingNavigation from "../../components/UtilityBar/FloatingNavigation";
import { Form, notification } from "antd/lib";
import { AuthContext } from "../../context/AuthContext";
import EgiftForm from "./EgiftForm";
import { set } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const EgiftDetailCustomer = () => {
  const { id } = useParams();
  const { auth } = useContext(AuthContext);
  const [egift, setEgift] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEgift = async () => {
      try {
        const response = await axios.get(`/egift/egifts/${id}`);
        setEgift(response.data.data);
      } catch (error) {
        setError("Lỗi khi lấy dữ liệu!");
      } finally {
        setLoading(false);
      }
    };

    fetchEgift();
  }, [id]);

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>{error}</p>;

  const sendEgiftToUser = async (values, auth, setIsFormVisible) => {
    console.log("Sending eGift with values:", values);
    if (!auth.token) {
      return notification.error({
        message: "Unauthorized",
        description: "You are not authorized to gift E-Gift card.",
      });
    }
    try {
      const response = await axios.post(`/egift/egift-cards/send/${id}`, values, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      setIsFormVisible(false);
      console.log("Response from sending eGift:", response);
      window.location.href = response.data.data;
      notification.success({ message: "Gift card to user successfully!" });
    } catch (error) {
      console.error("Lỗi khi gửi eGift:", error);
    }
  };

  const showGiftForm = () => {
    if (!auth.token) navigate("/login");
    else setIsFormVisible(true);
  }

  return (
    <div className="movie-detail-container">
      <div className="movie-detail-header">
        <p className="movie-detail-title">EGIFT</p>
      </div>
      <div className="moviecontent">
        <div className="moviemaininfo">
          <div className="detailimages">
            <img src={egift?.image} alt={egift?.name} />
            <button onClick={showGiftForm} className="btnsendgift">Send as gift</button>
          </div>
          <div className="movieinfo">
            <div className="movienamewrapper">
              <h2 className="moviename">{egift?.name}</h2>
            </div>
            <div className="movieinfowrapper">
              <p>
                <span className="label">Description:</span>{" "}
                <span className="value">{egift?.description}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <FloatingNavigation />
      <EgiftForm
        isFormVisible={isFormVisible}
        handleCancel={() => setIsFormVisible(false)}
        onFinish={(values) =>
          sendEgiftToUser(
            values,
            auth,
            setIsFormVisible,
          )
        }
      />
    </div>
  );
};

export default EgiftDetailCustomer;