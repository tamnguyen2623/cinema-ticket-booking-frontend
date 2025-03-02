import axios from "axios";

const apiUrl = "/ticket/tickets";

// Lấy tất cả phòng có status === false
export const fetchRooms = async (token) => {
  try {
    const response = await axios.get("/room/rooms", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const rooms = response.data.rooms || [];
    const filteredRooms = rooms.filter((room) => room.status === false);
    return filteredRooms;
  } catch (error) {
    throw new Error("Error fetching rooms: " + error.message);
  }
};

// Lấy tất cả giá vé
export const fetchTicket = async (token) => {
  try {
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("ticketticket", response);
    return response.data.ticketPrices || [];
  } catch (error) {
    throw new Error("Error fetching tickets: " + error.message);
  }
};

// Thêm/cập nhật giá vé
export const createOrUpdateTicket = async (
  token,
  ticketData,
  editingTicket
) => {
  try {
    const requestData = {
      roomType: ticketData.roomType,
      seatType: ticketData.seatType,
      price: ticketData.price,
    };

    let response;
    if (editingTicket) {
      response = await axios.put(
        `${apiUrl}/${editingTicket._id}`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } else {
      response = await axios.post(apiUrl, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    return response.data.ticketPrices;
  } catch (error) {
    throw new Error("Error creating/updating ticket: " + error.message);
  }
};

// Xóa vé
export const deleteTicket = async (token, ticketId) => {
  try {
    const response = await axios.delete(`${apiUrl}/${ticketId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Error deleting room: " + error.message);
  }
};

// Xem chi tiết vé
export const DetailTicket = async (token, ticketId) => {
  try {
    const response = await axios.get(`${apiUrl}/${ticketId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.ticketPrice;
  } catch (error) {
    throw new Error("Error deleting ticket: " + error.message);
  }
};

// Cập nhật trạng thái vé
export const toggleTicketStatus = async (token, ticketId, isDelete) => {
  try {
    const response = await axios.patch(
      `/ticket/tickets/${ticketId}/toggle-delete`,
      { isDelete },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.ticketPrice;
  } catch (error) {
    throw new Error("Error updating ticket status: " + error.message);
  }
};
