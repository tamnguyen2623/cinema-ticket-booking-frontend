import axios from "axios";
const apiUrl = "/ticket/tickets";

export const fetchTicket = async (token) => {
  try {
    const response = await axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.data || !response.data.ticketPrices) {
      throw new Error("No ticket prices found in response!");
    }
    const tickets = response.data.ticketPrices || [];
    const filteredTickets = tickets.filter(
      (ticket) => ticket.isDelete === false
    );
    return filteredTickets;
  } catch (error) {
    console.error("Error fetching tickets:", error);
    throw new Error("Error fetching tickets: " + error.message);
  }
};

// Update booking
export const updateBooking = async (id, body) => {
  try {
    const response = await axios.put(`/booking/booking/${id}`, body);
    return response.data; // Dữ liệu trả về từ API
  } catch (error) {
    console.log("Update booking error: ", error.response?.data || error.message);
    throw error;
  }
};