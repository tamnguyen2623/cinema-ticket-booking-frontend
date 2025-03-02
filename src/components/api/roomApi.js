import axios from "axios";
const apiUrl = "/room/rooms";

//  Lấy danh sách rạp chiếu
export const fetchCinemas = async () => {
  try {
    const response = await axios.get("/cinema");
    return response.data.data;
  } catch (error) {
    throw new Error("Error fetching cinemas: " + error.message);
  }
};

//  Lấy danh sách phòng với hỗ trợ tìm kiếm và lọc
export const fetchRooms = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await axios.get(`${apiUrl}?${queryParams}`);
    return response.data.rooms || [];
  } catch (error) {
    throw new Error("Error fetching rooms: " + error.message);
  }
};

// Tạo hoặc cập nhật phòng
export const createOrUpdateRoom = async (token, roomData, editingRoom) => {
  try {
    const requestData = {
      cinema: roomData.cinema,
      roomname: roomData.roomname,
      roomtype: roomData.roomtype,
      row: roomData.row,
      colum: roomData.colum,
    };

    let response;
    if (editingRoom) {
      response = await axios.put(`${apiUrl}/${editingRoom._id}`, requestData, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      response = await axios.post(apiUrl, requestData, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    return response.data.room;
  } catch (error) {
    throw new Error("Error creating/updating room: " + error.message);
  }
};

//  Xóa phòng
export const deleteRoom = async (token, roomId) => {
  try {
    const response = await axios.delete(`${apiUrl}/${roomId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error("Error deleting room: " + error.message);
  }
};

// Cập nhật status
export const updateRoomStatus = async (token, roomId, status) => {
  try {
    const response = await axios.patch(
      `http://localhost:8080/room/rooms/${roomId}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    throw new Error("Error updating room status: " + error.message);
  }
};

//  Lấy chi tiết phòng theo ID
export const DetailRoom = async (token, roomId) => {
  try {
    const response = await axios.get(`${apiUrl}/${roomId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error("Error fetching room details: " + error.message);
  }
};
