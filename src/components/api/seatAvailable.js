import axios from "axios";

// Get seats by movieShowingId
export const getSeatAvailablesBymovieShowingId = async (movieShowingId) => {
  try {
    const response = await axios.get(`/seatAvailable/${movieShowingId}`);
    console.log("Seats by movie showing:", response.data);
    return response.data; // Trả về dữ liệu để sử dụng
  } catch (error) {
    console.error(
      "Error fetching seats by room:",
      error.response?.data || error.message
    );
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};

// Add seats
export const createSeatAvailable = async (info) => {
  try {
    const response = await axios.post("/seatAvailable", info);
    return response.data; // Dữ liệu trả về từ API
  } catch (error) {
    console.log("Create seat available error: ", error.response?.data || error.message);
    throw error;
  }
};

// Update seat
export const updateSeatAvailable = async (seatIds) => {
  try {
    const response = await axios.put(`/seatAvailable`, { seatIds });
    return response.data; // Dữ liệu trả về từ API
  } catch (error) {
    console.log("Update seat error: ", error.response?.data || error.message);
    throw error;
  }
};