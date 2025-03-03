import {
  fetchCinemas,
  fetchRooms,
  createOrUpdateRoom,
  deleteRoom,
  DetailRoom,
  updateRoomStatus,
} from "../../components/api/roomApi";
import { createSeat } from "../../components/api/seat";
import { toast } from "react-toastify";
export const loadRoomsAndCinemas = async (
  setCinemas,
  setRooms,
  setLoadingCinemas,
  token
) => {
  try {
    const cinemasData = await fetchCinemas();
    const roomsData = await fetchRooms(token);

    setCinemas(cinemasData);
    setRooms(roomsData);
  } catch (error) {
    console.error("Error loading rooms & cinemas:", error);
  } finally {
    setLoadingCinemas(false);
  }
};

export const handleDeleteRoom = async (roomId, setRooms, token) => {
  if (!token) {
    return toast.error("You are not authorized to delete a room.");
  }
  try {
    await deleteRoom(token, roomId);
    const updatedRooms = await fetchRooms(token);
    setRooms(updatedRooms);
    toast.success("Room deleted successfully!");
  } catch (error) {
    console.error("Error deleting room:", error);
    toast.error("Error deleting room!");
  }
};

export const handleDetailRoom = async (
  roomId,
  setRoomDetail,
  setIsFormVisible,
  token
) => {
  if (!token) {
    return toast.error("You are not authorized to view room details.");
  }
  try {
    const detail = await DetailRoom(token, roomId);
    setRoomDetail(detail);
    setIsFormVisible(true);
  } catch (error) {
    console.error("Error fetching room details:", error);
    toast.error(
      "Failed to load room details. An error occurred while fetching details."
    );
  }
};

const createSeatsForRoom = async (roomId, values) => {
  if (!roomId) {
    console.error("Room ID is missing!");
    return;
  }
  try {
    await createSeat({
      room: roomId,
      column: values.colum,
      row: values.row,
    });
  } catch (error) {
    console.error("Error creating seats:", error);
  }
};

export const handleRoomSubmit = async (
  values,
  auth,
  editingRoom,
  setRooms,
  setIsFormVisible,
  setEditingRoom
) => {
  if (!auth.token) {
    return toast.error("You are not authorized to create or update a room.");
  }
  try {
    const roomData = await createOrUpdateRoom(auth.token, values, editingRoom);
    const roomId = editingRoom ? editingRoom._id : roomData._id;
    await createSeatsForRoom(roomId, values);
    const updatedRooms = await fetchRooms(auth.token);
    console.log("object updated", updatedRooms);
    setRooms(updatedRooms);
    setIsFormVisible(false);
    setEditingRoom(null);
    toast.success("Room saved successfully!");
  } catch (error) {
    console.error("Error creating/updating room:", error);
    toast.error("Failed to save the room. Please try again.");
  }
};

export const handleToggleStatus = async (token, roomId, status, setRooms) => {
  try {
    await updateRoomStatus(token, roomId, status);
    const updatedRooms = await fetchRooms(token);
    setRooms(updatedRooms);
    toast.success("Room status updated successfully!");
  } catch (error) {
    console.error("Error updating room status:", error);
    toast.error("Error updating room status!");
  }
};
