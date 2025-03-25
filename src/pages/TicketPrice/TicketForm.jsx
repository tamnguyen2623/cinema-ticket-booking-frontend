import React from "react";
import { Modal, Form, Select, Input } from "antd";
import "../../components/styles/ticketStyle.css";

const TicketForm = ({
  isVisible,
  isDetailModalVisible,
  onCancel,
  onDetailCancel,
  onSubmit,
  form,
  rooms = [],
  editingTicket,
  ticketDetail,
}) => {
  const room = [...new Set(rooms?.map((room) => room.roomtype))];
  return (
    <>
      <Modal
        title={editingTicket ? "Edit Ticket" : "Create Ticket"}
        open={isVisible}
        onOk={onSubmit}
        onCancel={onCancel}
        okButtonProps={{
          className: "addTicketButton",
        }}
      >
        <Form form={form} layout="vertical" name="ticketForm">
          <Form.Item
            name="roomType"
            label="Room Type"
            rules={[{ required: true }]}
          >
            <Select>
              {room.map((roomtype, index) => (
                <Select.Option key={index} value={roomtype}>
                  {roomtype}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="seatType"
            label="Seat Type"
            rules={[{ required: true }]}
          >
            <Select>
              <Select.Option value="Standard">Standard</Select.Option>
              <Select.Option value="VIP">VIP</Select.Option>
              <Select.Option value="Premium">Premium</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Ticket Detail"
        open={isDetailModalVisible}
        onCancel={onDetailCancel}
        footer={null}
      >
        {ticketDetail ? (
          <div>
            <p>
              <strong>Room Type:</strong> {ticketDetail.roomType}
            </p>
            <p>
              <strong>Seat Type:</strong> {ticketDetail.seatType}
            </p>
            <p>
              <strong>Price:</strong> {ticketDetail.price}
            </p>
            <p>
              <strong>Created At:</strong> {ticketDetail.createdAt}
            </p>
            <p>
              <strong>Updated At:</strong> {ticketDetail.updatedAt}
            </p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </Modal>
    </>
  );
};

export default TicketForm;