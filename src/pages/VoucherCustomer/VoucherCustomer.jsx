import React, { useEffect, useState } from "react";
import { Card, Button, Spin, Alert, message } from "antd";
import Slider from "react-slick";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../components/styles/VoucherCustomer.css"; // 🟢 Import CSS
import sliderSettings from "./sliderSettings"; // 🟢 Import cấu hình Slider
import { toast } from "react-toastify";
const VoucherCustomer = ({ setBookingData }) => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVoucher, setSelectedVoucher] = useState(() => {
    const existingBookingData =
      JSON.parse(localStorage.getItem("bookingData")) || {};
    return existingBookingData.selectedVoucher || null;
  });

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        const response = await axios.get("http://localhost:8080/voucher/list");
        console.log("API Response:", response.data);

        if (response.data && Array.isArray(response.data.vouchers)) {
          const filteredVouchers = response.data.vouchers.filter(
            (voucher) => !voucher.isUsed
          );
          setVouchers(filteredVouchers);
        } else {
          throw new Error("Invalid data format from API");
        }
      } catch (err) {
        console.error("Error fetching vouchers:", err);
        setError("Failed to load vouchers. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchVouchers();
  }, []);

  // ✅ Hàm chọn voucher (lưu ngay lập tức vào localStorage)
  //   const handleSelectVoucher = (voucher) => {
  //     setSelectedVoucher(voucher);

  //     const existingBookingData =
  //       JSON.parse(localStorage.getItem("bookingData")) || {};
  //     const updatedBookingData = {
  //       ...existingBookingData,
  //       selectedVoucher: voucher,
  //     };

  //     console.log("🔹 Updated bookingData:", updatedBookingData);
  //     localStorage.setItem("bookingData", JSON.stringify(updatedBookingData));

  //     console.log(
  //       "✅ Saved to localStorage:",
  //       JSON.parse(localStorage.getItem("bookingData"))
  //     );
  //     message.success(`Selected voucher: ${voucher.code}`);
  //   };
  const handleSelectVoucher = (voucher) => {
    if (selectedVoucher?._id === voucher._id) return; // Tránh cập nhật nếu không có sự thay đổi

    setSelectedVoucher(voucher);

    setBookingData((prevData) => {
      const updatedData = { ...prevData, selectedVoucher: voucher };
      localStorage.setItem("bookingData", JSON.stringify(updatedData));
      console.log("🔹 Updated bookingData:", updatedData);
      return updatedData;
    });

    toast.success(`Selected voucher code: ${voucher.code}`);
  };

  // ✅ Định dạng ngày hết hạn
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="voucher-container">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="voucher-container">
        <Alert message={error} type="error" />
      </div>
    );
  }

  return (
    <div className="voucher-container">
      <strong className="voucher-title">Choose voucher: </strong>

      {vouchers.length > 0 ? (
        <div className="voucher-slider-container">
          <Slider {...sliderSettings}>
            {vouchers.map((voucher) => (
              <div key={voucher._id} className="voucher-slide">
                <Card
                  onClick={() => handleSelectVoucher(voucher)}
                  className={`voucher-card ${
                    selectedVoucher?._id === voucher._id
                      ? "selected"
                      : "default"
                  }`}
                >
                  <div className="voucher-info">
                    <div>
                      <h3 className="voucher-discount">
                        Giảm {voucher.discount}%
                      </h3>
                      <h4 className="voucher-code">Mã: {voucher.code}</h4>
                    </div>
                    <div>
                      <p className="voucher-expiry">
                        HSD: {formatDate(voucher.expiredDate)}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </Slider>
        </div>
      ) : (
        <Alert message="No vouchers available" type="info" />
      )}
    </div>
  );
};

export default VoucherCustomer;
