import React, { useState, useEffect } from "react";
import CinemaList from "../components/Contact/CinemaList";
import CinemaDetail from "../components/Contact/CinemaDetail";
import { getAllCinema } from "../components/api/cinema";
import "../components/Contact/Contact.css"

export default function Contact() {
  const [selectedCinema, setSelectedCinema] = useState();
  const [cinemas, setCinemas] = useState([]);

  const fetchCinemas = async () => {
    const data = await getAllCinema();
    setCinemas(data.data);
    setSelectedCinema(data.data[0]);
    console.log(data.data);
  };

  useEffect(() => {
    fetchCinemas();
  }, []);

  return (
    <div className="contact__container">
      <CinemaList
        cinemas={cinemas}
        selectedCinema={selectedCinema}
        setSelectedCinema={setSelectedCinema}
      />
      <CinemaDetail cinema={selectedCinema} />
    </div>
  );
}
