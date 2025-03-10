import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import FeedbackForm from "./FeedbackForm";
import { getFeedback } from "../api/feedback";
import moment from "moment";

export default function FeedbackDetail({
  userId,
  booking,
  fetchBookings,
  handleCancelViewModal,
}) {
  const [feedback, setFeedback] = useState();
  const [updateModal, setUpdateModal] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const showModal = () => {
    setUpdateModal(true);
  };

  const handleCancelUpdateModal = () => {
    setUpdateModal(false);
    setRefresh(!refresh);
  };

  useEffect(() => {
    fetchFeedback();
  }, [refresh]);

  const fetchFeedback = async () => {
    try {
      const data = await getFeedback(booking._id);
      setFeedback(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <div className="review-input">
        <div className="feedback__review-rating">
          <label>Ratting</label>
          <div className="feedback__star-container">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${
                  star <= feedback?.ratting ? "filled" : ""
                }`}
              >
                ★
              </span>
            ))}
          </div>
        </div>
        <div className="feedback__review-textarea">
          <p>{feedback?.comment}</p>
          <p className="review-date">
            {moment(feedback?.date).format("DD/MM/YYYY HH:mm")}
          </p>
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <button onClick={showModal} className="feedback__review-submit-btn">
          Update
        </button>
        <button
          key="back"
          onClick={handleCancelViewModal}
          className="feedback__review-submit-btn"
        >
          Cancel
        </button>
      </div>
      <Modal
        title={`Ratting & Feedback "${booking?.movieName}"`}
        open={updateModal}
        onCancel={handleCancelUpdateModal}
        width={1000}
        footer={null}
      >
        <FeedbackForm
          userId={userId}
          form={"Update"}
          booking={booking}
          setModal={setUpdateModal}
          fetchBookings={fetchBookings}
          handleCancelModal={handleCancelUpdateModal}
          refresh={refresh}
          setRefresh={setRefresh}
        />
      </Modal>
    </>
  );
}
