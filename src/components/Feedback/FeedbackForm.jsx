import React, { useState, useEffect } from "react";
import { Select } from "antd";
import { getMovies } from "../api/movieApi";

export default function FeedbackForm({ onFilterChange }) {
  return (
    <>
      <div className="review-header-title">
        <h3>Xếp hạng và đánh giá phim</h3>
      </div>
      <div className="review-input">
        <div className="review-rating">
          <label>Xếp hạng</label>
          <div className="star-container">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className={`star ${star <= (hover || rating) ? "filled" : ""}`}
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
          placeholder="Nhập bình luận của bạn..."
        ></textarea>
        <button className="review-submit-btn">Bình luận</button>
      </div>
    </>
  );
}
