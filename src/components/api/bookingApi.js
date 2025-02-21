import axios from "axios";

const API_URL = "/booking/bookings"; // Đường dẫn API Booking

export const getAllMovies = async () => {
  try {
    const response = await axios.get("/movie");
    return response.data.data;
  } catch (error) {
    console.error(error);
  }
};
export const getAllRoom = async () => {
  try {
    const response = await axios.get("/room/rooms");
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
export const getAllCinema = async () => {
  try {
    const response = await axios.get("/cinema");
    return response.data.data;
  } catch (error) {
    console.error(error);
  }
};

export const getMovieShowing = async () => {
  try {
    const response = await axios.get("/movieshowing/movieshowings");
    console.log("object returned", response);
    return response.data.data;
  } catch (error) {
    console.error(error);
  }
};

export const getMovieShowings = async (movieId) => {
  try {
    const response = await axios.get(`/movieshowing/movieshowings/${movieId}`);
    console.log("API response:", response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// 🟢 Tạo đặt vé mới
export const createBooking = async (bookingData, token) => {
  try {
    const response = await axios.post(`${API_URL}/create`, bookingData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Error creating booking: " + error.response.data.error);
  }
};

// 🟢 Lấy danh sách đặt vé của người dùng
export const getUserBookings = async (userId, token) => {
  try {
    const response = await axios.get(`${API_URL}/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.bookings;
  } catch (error) {
    throw new Error(
      "Error fetching user bookings: " + error.response.data.error
    );
  }
};

// 🟢 Xử lý thanh toán qua VNPAY
export const processPayment = async (amount, orderId, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/payment`,
      { amount, orderId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.vnpUrl; // Trả về URL thanh toán VNPAY
  } catch (error) {
    throw new Error("Error processing payment: " + error.response.data.error);
  }
};

// 🟢 Xác nhận thanh toán từ VNPAY
export const verifyPayment = async (queryParams) => {
  try {
    const response = await axios.get(`${API_URL}/verify`, {
      params: queryParams,
    });
    return response.data;
  } catch (error) {
    throw new Error("Error verifying payment: " + error.response.data.error);
  }
};
