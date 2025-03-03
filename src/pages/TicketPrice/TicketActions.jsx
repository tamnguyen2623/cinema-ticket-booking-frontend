import {
  fetchTicket,
  createOrUpdateTicket,
  deleteTicket,
  DetailTicket,
  toggleTicketStatus,
} from "../../components/api/ticketApi";
import { toast } from "react-toastify";
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
    toast.error(`Error: ${error.message}`);
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
    toast.success(editingTicket ? "Ticket updated!" : "Ticket created!");
    setIsModalVisible(false);
    fetchTickets();
  } catch (error) {
    toast.error(`Error: ${error.message}`);
  }
};

export const handleDelete = async (auth, ticketId, fetchTickets) => {
  try {
    await deleteTicket(auth.token, ticketId);
    toast.success("Ticket deleted successfully!");
    fetchTickets();
  } catch (error) {
    toast.error(`Error: ${error.message}`);
  }
};

export const showDetailModal = async (
  auth,
  roomId,
  setTicketDetail,
  setIsDetailModalVisible
) => {
  if (!auth?.token) {
    toast.error("You are not authorized to view room details.");
    return;
  }
  try {
    const detail = await DetailTicket(auth.token, roomId);
    setTicketDetail(detail);
    setIsDetailModalVisible(true);
    toast.success("Room details loaded successfully!");
  } catch (error) {
    toast.error(`Failed to load room details: ${error.message}`);
  }
};
export const handleToggleIsDelete = async (
  auth,
  ticketId,
  isDelete,
  fetchTickets
) => {
  try {
    await toggleTicketStatus(auth.token, ticketId, isDelete);
    toast.success("Update disabled successfully!");
    fetchTickets(); // ✅ Gọi API để cập nhật danh sách vé từ server
  } catch (error) {
    toast.error(`Failed update disabled : ${error.message}`);
  }
};
