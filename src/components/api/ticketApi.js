import axios from "axios";

const apiUrl = "/ticket/tickets";

export const fetchRooms = async (token) => {
  try {
    const response = await axios.get("/room/rooms", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("rooms", response);
    return response.data.rooms || [];
  } catch (error) {
    throw new Error("Error fetching tickets: " + error.message);
  }
};
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

export const createOrUpdateTicket = async (
  token,
  ticketData,
  editingTicket
) => {
  try {
    const requestData = {
      roomId: ticketData.roomId,
      seatType: ticketData.seatType,
      price: Number(ticketData.price), // ✅ Chuyển thành số
    };

    console.log("📡 Dữ liệu gửi lên API:", requestData); // ✅ Debug

    let response;
    if (editingTicket) {
      response = await axios.put(
        `${apiUrl}/${editingTicket._id}`,
        requestData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } else {
      response = await axios.post(apiUrl, requestData, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    console.log("✅ API response:", response.data);
    return response.data.ticketPrices;
  } catch (error) {
    console.error("❌ Lỗi API:", error.response?.data || error.message);
    throw new Error("Error creating/updating ticket: " + error.message);
  }
};

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
