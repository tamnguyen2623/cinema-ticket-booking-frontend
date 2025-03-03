import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Carousel, Card, Button, InputNumber, message } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import axios from "axios";
import "../../components/styles/Combo.css";

const { Meta } = Card;

const ComboCarousel = () => {
  const [combos, setCombos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const carouselRef = useRef(null);

  const [selectedCombos, setSelectedCombos] = useState(() => {
    const bookingData = JSON.parse(localStorage.getItem("bookingData")) || {};
    return Array.isArray(bookingData.selectedCombos)
      ? bookingData.selectedCombos
      : [];
  });

  useEffect(() => {
    const fetchCombos = async () => {
      try {
        const response = await axios.get("http://localhost:8080/combo");
        if (response.data && Array.isArray(response.data.data)) {
          setCombos(response.data.data);
        } else {
          throw new Error("Invalid data format from API");
        }
      } catch (err) {
        console.error("Error fetching combos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCombos();
  }, []);

  const handleQuantityChange = (combo, value) => {
    setSelectedCombos((prevCombos) => {
      const updatedCombos = [...prevCombos];

      const existingIndex = updatedCombos.findIndex((c) => c._id === combo._id);

      if (existingIndex !== -1) {
        updatedCombos[existingIndex].quantity = value;
      } else {
        updatedCombos.push({
          _id: String(combo._id),
          name: combo.name,
          image: combo.image,
          price: combo.price,
          description: combo.description,
          quantity: value,
        });
      }

      return updatedCombos;
    });
  };

  const handleConfirmSelection = () => {
    const existingBookingData =
      JSON.parse(localStorage.getItem("bookingData")) || {};

    const filteredCombos = selectedCombos.filter((combo) => combo.quantity > 0);

    const updatedBookingData = {
      ...existingBookingData,
      selectedCombos: filteredCombos,
    };

    localStorage.setItem("bookingData", JSON.stringify(updatedBookingData));

    message.success("You have confirmed your combo selection!");
    console.log("Saved to bookingData:", updatedBookingData);
  };

  return (
    <div className="combo-container">
      <h2 className="combo-title">Choose Your Combo</h2>
      {loading ? (
        <p>Loading combos...</p>
      ) : (
        <div className="carousel-container">
          <Button
            className="carousel-arrow left-arrow"
            icon={<LeftOutlined />}
            onClick={() => carouselRef.current && carouselRef.current.prev()}
          />
          <Carousel
            autoplay
            dots={true}
            slidesToShow={3}
            slidesToScroll={1}
            ref={carouselRef}
            className="combo-slider"
          >
            {combos.map((combo) => {
              const existingCombo = selectedCombos.find(
                (c) => c._id === combo._id
              );
              const selectedQuantity = existingCombo
                ? existingCombo.quantity
                : 0;

              return (
                <div key={combo._id} className="combo-slide">
                  <Card
                    hoverable
                    className="combo-card"
                    cover={
                      <img
                        alt={combo.name}
                        src={combo.image}
                        className="combo-image"
                      />
                    }
                  >
                    <Meta
                      title={combo.name}
                      description={
                        <strong className="combo-description">
                          Price: ${combo.price}
                        </strong>
                      }
                    />
                    <strong className="combo-description">
                      Description: {combo.description}
                    </strong>

                    <div className="combo-actions">
                      <InputNumber
                        min={0}
                        max={50}
                        value={selectedQuantity}
                        onChange={(value) => handleQuantityChange(combo, value)}
                        className="combo-input"
                      />
                    </div>
                  </Card>
                </div>
              );
            })}
          </Carousel>
          <Button
            className="carousel-arrow right-arrow"
            icon={<RightOutlined />}
            onClick={() => carouselRef.current && carouselRef.current.next()}
          />
        </div>
      )}

      <Button
        type="primary"
        className="combo-button confirm-button"
        onClick={handleConfirmSelection}
      >
        Confirm
      </Button>

      <Button
        type="primary"
        className="combo-button next-button"
        onClick={() => navigate("/totalslide")}
      >
        Next
      </Button>
    </div>
  );
};

export default ComboCarousel;
