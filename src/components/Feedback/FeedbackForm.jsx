import React, { useState, useEffect } from "react";
import { updateBooking } from "../api/bookingApi";
import { createFeedback, getFeedback, updateFeedback } from "../api/feedback";

export default function FeedbackForm({
  userId,
  form,
  booking,
  setModal,
  fetchBookings,
  handleCancelModal,
  setRefresh,
  refresh,
}) {
  const [feedbackId, setFeedbackId] = useState("");
  const [hover, setHover] = useState(0);
  const [ratting, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchFeedback();
  }, [refresh]);

  const fetchFeedback = async () => {
    try {
      if (form === "Add") {
        setRating(0);
        setComment("");
        setFeedbackId("");
        setError("");
      } else {
        const data = await getFeedback(booking._id);
        setRating(data.ratting);
        setComment(data.comment);
        setFeedbackId(data._id);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const submit = async () => {
    // Kiểm tra điều kiện trước khi gửi
    if (ratting === 0) {
      setError("Select at least 1 star!");
      return;
    }

    if (comment.trim() === "") {
      setError("Comment cannot be empty!");
      return;
    }

    try {
      const body = {
        userId: userId,
        movieId: booking.movieId,
        bookingId: booking._id,
        ratting: ratting,
        comment: comment.trim(),
      };
      if (form === "Update") {
        await updateFeedback(feedbackId, body);
        setRefresh(!refresh);
      } else {
        await createFeedback(body);
        await updateBooking(booking._id, { userId: userId, isFeedback: true });
      }

      setModal(false);
      setRefresh(!refresh);
      fetchBookings();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <div className="review-input">
        <div className="review-rating">
          <label>Ratting</label>
          <div className="star-container">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${star <= (hover || ratting) ? "filled" : ""}`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              >
                ★
              </span>
            ))}
          </div>
        </div>
        <textarea
          className="review-textarea"
          placeholder="Write your feelings about the movie..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex justify-end gap-2 mt-4">
        <button onClick={submit} className="feedback__review-submit-btn">
          {form === "Add" ? "Feedback" : "Save"}
        </button>
        <button
          key="back"
          onClick={handleCancelModal}
          className="feedback__review-submit-btn"
        >
          Cancel
        </button>
      </div>
    </>
  );
}
