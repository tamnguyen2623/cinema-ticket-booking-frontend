import axios from "axios";

// Get all feedbacks
export const getAllCinema = async () => {
  try {
    const response = await axios.get("/cinema");
    console.log("All cinemas:", response.data);
    return response.data; // Trả về dữ liệu để sử dụng
  } catch (error) {
    console.error(
      "Error fetching cinemas:",
      error.response?.data || error.message
    );
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};
