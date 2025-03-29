import axios from "axios";

// Get all banners
export const getAll = async () => {
  try {
    const response = await axios.get("/banner");
    console.log("All banners:", response.data);
    return response.data; // Trả về dữ liệu để sử dụng
  } catch (error) {
    console.error(
      "Error fetching banners:",
      error.response?.data || error.message
    );
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};

// Get available banners
export const getAvailableBanners = async (movieId) => {
  try {
    const response = await axios.get(`/banner/getAvailableBanner`);
    console.log("Banners:", response.data);
    return response.data; // Trả về dữ liệu để sử dụng
  } catch (error) {
    console.error(
      "Error fetching banners:",
      error.response?.data || error.message
    );
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};

// Get available banners by movieID
export const filterBanner = async (search) => {
  try {
    const response = await axios.get(`/banner/filter/${search}`);
    console.log("Filter banners:", response.data);
    return response.data; // Trả về dữ liệu để sử dụng
  } catch (error) {
    console.error(
      "Error fetching filter banners:",
      error.response?.data || error.message
    );
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
};

// Add banner
export const createBanner = async (newBanner) => {
  try {
    const response = await axios.post("/banner", newBanner);
    return response.data; // Dữ liệu trả về từ API
  } catch (error) {
    console.log("Create banner error: ", error.response?.data || error.message);
    throw error;
  }
};

// Update banner
export const updateBanner = async (bannerId, body) => {
    try {
      const response = await axios.put(`/banner/${bannerId}`, body);
      return response.data; // Dữ liệu trả về từ API
    } catch (error) {
      console.log("Update banner error: ", error.response?.data || error.message);
      throw error;
    }
  };

// Update isDelete banner
export const updateIsDeleteBanner = async (bannerId, body) => {
  try {
    const response = await axios.put(`/banner/updateIsDelete/${bannerId}`, body);
    return response.data; // Dữ liệu trả về từ API
  } catch (error) {
    console.log("Update isDelete banner error: ", error.response?.data || error.message);
    throw error;
  }
};
