import React, { useState, useEffect } from "react";

export default function CinemaList({
  cinemas,
  selectedCinema,
  setSelectedCinema,
}) {
  return (
    <div className="contact__cinema-list">
      {cinemas.map((cinema) => (
        <div
          key={cinema._id}
          className={`movie-option ${
            selectedCinema === cinema ? "active" : ""
          }`}
          onClick={() =>
            setSelectedCinema(selectedCinema === cinema ? null : cinema)
          }
        >
          {/* {selectedCinema === cinema && <span className="checkmark">✓</span>} */}
          {cinema.name}
        </div>
      ))}
    </div>
  );
}
