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
          className={`contact__movie-option ${
            selectedCinema === cinema ? "active" : ""
          }`}
          onClick={() => setSelectedCinema(cinema)}
        >
          {cinema.name}
        </div>
      ))}
    </div>
  );
}
