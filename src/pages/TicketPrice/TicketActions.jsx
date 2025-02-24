import {
  fetchTicket,
  createOrUpdateTicket,
  deleteTicket,
  DetailTicket,
} from "../../components/api/ticketApi";
import { notification } from "antd";

export const fetchTickets = async (
  auth,
  setTickets,
  setFilteredTickets,
  searchTerm = "",
  filter = "all"
) => {
  try {
    if (!auth?.token) {
      console.error("Unauthorized: No token available");
      return;
    }
    const fetchedTickets = await fetchTicket(auth.token);
    setTickets(fetchedTickets);
    const filteredData = applyFilters(fetchedTickets, searchTerm, filter);
    setFilteredTickets(filteredData);
  } catch (error) {
    notification.error({ message: "Error", description: error.message });
  }
};

export const applyFilters = (tickets, searchTerm, filter) => {
  let filteredData = [...tickets];
  if (searchTerm) {
    filteredData = filteredData.filter(
      (ticket) =>
        ticket.roomType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.seatType.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  if (filter !== "all") {
    filteredData = filteredData.filter((ticket) => ticket.roomType === filter);
  }
  return filteredData;
};

export const handleCreateOrUpdateTicket = async (
  auth,
  form,
  editingTicket,
  setIsModalVisible,
  fetchTickets
) => {
  try {
    const values = await form.validateFields();
    if (!values.roomType || !values.seatType || !values.price)
      throw new Error("Missing required fields");
    await createOrUpdateTicket(auth.token, values, editingTicket);
    notification.success({
      message: editingTicket ? "Ticket updated" : "Ticket created",
    });
    setIsModalVisible(false);
    fetchTickets();
  } catch (error) {
    notification.error({ message: "Error", description: error.message });
  }
};

export const handleDelete = async (auth, ticketId, fetchTickets) => {
  try {
    await deleteTicket(auth.token, ticketId);
    notification.success({
      message: "Ticket deleted",
      description: "The ticket has been successfully deleted.",
    });
    fetchTickets();
  } catch (error) {
    notification.error({ message: "Error", description: error.message });
  }
};

export const showDetailModal = async (
  auth,
  roomId,
  setTicketDetail,
  setIsDetailModalVisible
) => {
  if (!auth?.token) {
    notification.error({
      message: "Unauthorized",
      description: "You are not authorized to view room details.",
    });
    return;
  }
  try {
    const detail = await DetailTicket(auth.token, roomId);
    setTicketDetail(detail);
    setIsDetailModalVisible(true);
    notification.success({ message: "Room details loaded successfully!" });
  } catch (error) {
    notification.error({
      message: "Failed to load room details",
      description: error.message,
    });
  }
};
