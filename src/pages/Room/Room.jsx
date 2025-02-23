import React, { useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "../../context/AuthContext";
import RoomList from "./RoomList";
import RoomForm from "./RoomForm";
import {
  loadRoomsAndCinemas,
  handleDeleteRoom,
  handleRoomSubmit,
  handleDetailRoom,
} from "./RoomActions";
import "../../components/styles/RoomList.css";

const Room = () => {
  const { auth } = useContext(AuthContext);
  const [rooms, setRooms] = useState([]);
  const [cinemas, setCinemas] = useState([]);
  const [loadingCinemas, setLoadingCinemas] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [roomDetail, setRoomDetail] = useState(null);

  useEffect(() => {
    loadRoomsAndCinemas(setCinemas, setRooms, setLoadingCinemas, auth.token);
  }, [auth.token]);

  useEffect(() => {
    console.log("🔄 Rooms updated in Room.js:", rooms);
  }, [rooms]); 

  const handleEdit = useCallback((room) => {
    setEditingRoom(room);
    setRoomDetail(null);
    setIsFormVisible(true);
  }, []);

  const handleDelete = useCallback(
    (id) => handleDeleteRoom(id, setRooms, auth.token),
    [auth.token]
  );

  const handleDetail = useCallback(
    (id) => handleDetailRoom(id, setRoomDetail, setIsFormVisible, auth.token),
    [auth.token]
  );

  return (
    <div className="room-container">
      <RoomList
        rooms={rooms}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleDetail={handleDetail}
        cinemas={cinemas}
        handleAddRoom={() => {
          setEditingRoom(null);
          setRoomDetail(null);
          setIsFormVisible(true);
        }}
      />

      <RoomForm
        isFormVisible={isFormVisible}
        handleCancel={() => setIsFormVisible(false)}
        onFinish={(values) =>
          handleRoomSubmit(
            values,
            auth,
            editingRoom,
            setRooms,
            setIsFormVisible,
            setEditingRoom
          )
        }
        editingRoom={editingRoom}
        cinemas={cinemas}
        loadingCinemas={loadingCinemas}
        roomDetail={roomDetail}
      />
    </div>
  );
};

export default Room;
