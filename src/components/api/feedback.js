import axios from "axios";

// Get all feedbacks
export const getAll = async () => {
  try {
    const response = await axios.get("/feedback");
    console.log("All feedbacks:", response.data);
    return response.data; // Trả về dữ liệu để sử dụng
  } catch (error) {
    console.error(
      "Error fetching feedbacks:",
      error.response?.data || error.message
    );
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};

// Get available feedbacks by movieID
export const getAvailableFeedbacks = async (movieId) => {
  try {
    const response = await axios.get(`/feedback/getAvailableFeedback/${movieId}`);
    console.log("Feedbacks by movie:", response.data);
    return response.data; // Trả về dữ liệu để sử dụng
  } catch (error) {
    console.error(
      "Error fetching feedbacks by movie:",
      error.response?.data || error.message
    );
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};

// Get feedback by user & movie
export const getFeedback = async (bookingId) => {
  try {
    const response = await axios.get(`/feedback/getFeedback/${bookingId}`);
    console.log("Feedbacks by user & movie:", response.data);
    return response.data; // Trả về dữ liệu để sử dụng
  } catch (error) {
    console.error(
      "Error fetching feedbacks by user & movie:",
      error.response?.data || error.message
    );
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};

// Get available feedbacks by movieID
export const filterFeedback = async (movieId) => {
  try {
    const response = await axios.get(`/feedback/filter/${movieId}`);
    console.log("Feedbacks by movie:", response.data);
    return response.data; // Trả về dữ liệu để sử dụng
  } catch (error) {
    console.error(
      "Error fetching feedbacks by movie:",
      error.response?.data || error.message
    );
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};

// Add feedback
export const createFeedback = async (newFeedback) => {
  try {
    const response = await axios.post("/feedback", newFeedback);
    return response.data; // Dữ liệu trả về từ API
  } catch (error) {
    console.log("Create feedback error: ", error.response?.data || error.message);
    throw error;
  }
};

// Update feedback
export const updateFeedback = async (feedbackId, body) => {
  try {
    const response = await axios.put(`/feedback/${feedbackId}`, body);
    return response.data; // Dữ liệu trả về từ API
  } catch (error) {
    console.log("Update feedback error: ", error.response?.data || error.message);
    throw error;
  }
};
