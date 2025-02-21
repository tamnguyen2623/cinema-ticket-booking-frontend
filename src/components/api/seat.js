import axios from "axios";

// Get all seat
export const getAll = async () => {
  try {
    const response = await axios.get("/seat");
    console.log("All seats:", response.data);
    return response.data; // Trả về dữ liệu để sử dụng
  } catch (error) {
    console.error(
      "Error fetching seats:",
      error.response?.data || error.message
    );
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};

// Get seats by roomID
export const getSeatsByRoomId = async (roomId) => {
  try {
    const response = await axios.get(`/seat/${roomId}`);
    console.log("Seats by Room:", response.data);
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
export const createSeat = async (roomInfo) => {
  try {
    const response = await axios.post("/seat", roomInfo);
    return response.data; // Dữ liệu trả về từ API
  } catch (error) {
    console.log("Create seat error: ", error.response?.data || error.message);
    throw error;
  }
};

// Update seat
export const updateSeat = async (seatId, seatInfo) => {
  try {
    const response = await axios.put(`/seat/${seatId}`, seatInfo);
    return response.data; // Dữ liệu trả về từ API
  } catch (error) {
    console.log("Update seat error: ", error.response?.data || error.message);
    throw error;
  }
};