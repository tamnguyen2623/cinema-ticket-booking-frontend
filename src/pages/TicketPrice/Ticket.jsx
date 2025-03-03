import React, { useState, useEffect, useContext } from "react";
import { Form } from "antd";
import { AuthContext } from "../../context/AuthContext";
import { fetchRooms } from "../../components/api/ticketApi";
import TicketList from "./TicketList";
import TicketForm from "./TicketForm";
import {
  fetchTickets,
  handleCreateOrUpdateTicket,
  handleDelete,
  showDetailModal,
} from "./TicketActions";
import "../../components/styles/ticketStyle.css";

const Ticket = () => {
  const { auth } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [ticketDetail, setTicketDetail] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [form] = Form.useForm();

  const fetchTicketsFromServer = () => {
    fetchTickets(auth, setTickets, setFilteredTickets, searchTerm, filter);
  };

  useEffect(() => {
    fetchTicketsFromServer();
    fetchRooms(auth.token).then(setRooms);
  }, [auth?.token]);

  useEffect(() => {
    fetchTicketsFromServer();
  }, [searchTerm, filter, auth?.token]);

  const showModal = (ticket) => {
    if (ticket) {
      form.setFieldsValue(ticket);
      setEditingTicket(ticket);
    } else {
      form.resetFields();
      setEditingTicket(null);
    }
    setIsModalVisible(true);
  };

  return (
    <div className="container-fluid">
      <div className="title-ticket">Ticket List</div>
      <TicketForm
        isVisible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onDetailCancel={() => setIsDetailModalVisible(false)}
        onSubmit={() =>
          handleCreateOrUpdateTicket(
            auth,
            form,
            editingTicket,
            setIsModalVisible,
            fetchTicketsFromServer
          )
        }
        form={form}
        rooms={rooms}
        editingTicket={editingTicket}
        isDetailModalVisible={isDetailModalVisible}
        ticketDetail={ticketDetail}
      />
      <TicketList
        tickets={filteredTickets}
        auth={auth}
        fetchTickets={fetchTicketsFromServer} // ✅ Truyền fetchTickets vào TicketList
        showDetailModal={(id) =>
          showDetailModal(auth, id, setTicketDetail, setIsDetailModalVisible)
        }
        showModal={showModal}
        handleDelete={(id) => handleDelete(auth, id, fetchTicketsFromServer)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filter={filter}
        setFilter={setFilter}
        rooms={rooms}
      />
    </div>
  );
};

export default Ticket;
