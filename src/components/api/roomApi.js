import axios from "axios";

const apiUrl = "/room/rooms";

export const fetchCinemas = async () => {
  try {
    const response = await axios.get("/cinema");
    return response.data.data;
  } catch (error) {
    throw new Error("Error fetching cinemas: " + error.message);
  }
};

export const fetchRooms = async (token) => {
  try {
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.rooms || [];
  } catch (error) {
    throw new Error("Error fetching rooms: " + error.message);
  }
};

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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } else {
      response = await axios.post(apiUrl, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    return response.data.room;
  } catch (error) {
    throw new Error("Error creating/updating room: " + error.message);
  }
};

export const deleteRoom = async (token, roomId) => {
  try {
    const response = await axios.delete(`${apiUrl}/${roomId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Error deleting room: " + error.message);
  }
};

export const DetailRoom = async (token, roomId) => {
  try {
    const response = await axios.get(`${apiUrl}/${roomId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Error deleting room: " + error.message);
  }
};
