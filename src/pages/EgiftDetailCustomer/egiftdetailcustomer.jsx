import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { IconButton } from "@mui/material";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import "./egiftdetailcustomer.css";
import FloatingNavigation from "../../components/UtilityBar/FloatingNavigation";
import { Form } from "antd/lib";
import { AuthContext } from "../../context/AuthContext";
import EgiftForm from "./EgiftForm";
import { set } from "react-hook-form";

const EgiftDetailCustomer = () => {
  const { id } = useParams();
  const { auth } = useContext(AuthContext);
  const [egift, setEgift] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [form] = Form.useForm();

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
      if (!auth.token) {
        return notification.error({
          message: "Unauthorized",
          description: "You are not authorized to create or update a movie.",
        });
      }
    try {
      const response = await axios.post(`/egift/egift-cards/send/${id}`, values, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      setIsFormVisible(false);
      notification.success({ message: "Gift card to user successfully!" });
    } catch (error) {
      console.error("Lỗi khi gửi eGift:", error);
    }
  };

  const showGiftForm = () => {
    setIsFormVisible(true);
  }

  return (
    <div className="movie-detail-container">
      <div className="movie-detail-header">
        <p className="movie-detail-title">EGIFT</p>
      </div>
      <div className="movie-detail-content">
        <div className="movie-detail-main-info">
          <div className="detail-images">
            <img src={egift?.image} alt={egift?.name} />
            <button className="btn-book-ticket">Buy card</button>
            <button onClick={showGiftForm} className="btn-book-ticket">Gift card</button>
          </div>
          <div className="movie-detail-info">
            <div className="movie-detail-name-wrapper">
              <h2 className="movie-detail-name">{egift?.name}</h2>
            </div>
            <div className="movie-detail-inf-wrapper">
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
