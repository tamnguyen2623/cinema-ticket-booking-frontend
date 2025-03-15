import axios from "axios";

const API_URL = "/support/support";

// Lấy danh sách Support
export const fetchSupport = async (token) => {
  try {
    const response = await axios.get(`${API_URL}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching support list:", error);
    throw new Error("Failed to fetch support list.");
  }
};

// Lấy một Support theo ID
export const getSupportById = async (token, supportId) => {
  try {
    const response = await axios.get(`${API_URL}/${supportId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching support by ID:", error);
    throw new Error("Failed to fetch support.");
  }
};

// Tạo hoặc cập nhật Support
export const createOrUpdateSupport = async (token, supportData, supportId = null) => {
  try {
    const url = supportId ? `${API_URL}/${supportId}` : `${API_URL}`;
    const method = supportId ? "put" : "post";

    const response = await axios({
      method,
      url,
      headers: { Authorization: `Bearer ${token}` },
      data: supportData,
    });

    return response.data;
  } catch (error) {
    console.error("Error creating/updating support:", error);
    throw new Error("Failed to create or update support.");
  }
};

// Xóa mềm Support (cập nhật isDelete = true)
export const deleteSupport = async (token, supportId) => {
  try {
    const response = await axios.delete(`${API_URL}/${supportId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting support:", error);
    throw new Error("Failed to delete support.");
  }
};

// Toggle trạng thái `isDelete`
export const toggleSupportStatus = async (token, supportId, isDelete) => {
  try {
    const response = await axios.patch(`${API_URL}/${supportId}/toggle-delete`, { isDelete }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error toggling support status:", error);
    throw new Error("Failed to toggle support status.");
  }
};
