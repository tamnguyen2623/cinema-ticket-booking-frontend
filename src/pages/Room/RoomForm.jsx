import React, { useEffect } from "react";
import { Modal, Form, Input, Select, Button, Spin } from "antd";
import SeatMap from "../../components/Seat/SeatMap";

const { Option } = Select;

const RoomForm = ({
  isFormVisible,
  handleCancel,
  onFinish,
  editingRoom,
  cinemas,
  loadingCinemas,
  isSubmitting,
  roomDetail,
}) => {
  const [form] = Form.useForm();
  useEffect(() => {
    if (isFormVisible) {
      form.setFieldsValue(
        roomDetail ||
          editingRoom || {
            roomname: "",
            roomtype: "Standard",
            row: 1,
            colum: 1,
            cinema: undefined,
          }
      );
    }
  }, [isFormVisible, editingRoom, roomDetail, form]);

  return (
    <Modal
      title={
        roomDetail ? "Room Details" : editingRoom ? "Edit Room" : "Create Room"
      }
      open={isFormVisible}
      onCancel={handleCancel}
      footer={null}
      width={roomDetail ? "80%" : "50%"}
    >
      {roomDetail ? (
        <div>
          <p>
            <strong>Room Name:</strong> {roomDetail.room?.roomname}
          </p>
          <p>
            <strong>Cinema:</strong> {roomDetail.room?.cinema?.name}
          </p>
          <p>
            <strong>Type:</strong> {roomDetail.room?.roomtype}
          </p>
          <p>
            <strong>Rows:</strong> {roomDetail.room?.row}
          </p>
          <p>
            <strong>Columns:</strong> {roomDetail.room?.colum}
          </p>
          <p>
            <strong>Created At:</strong> {roomDetail.room?.createdAt}
          </p>
          <p>
            <strong>Updated At:</strong> {roomDetail.room?.updatedAt}
          </p>
          <h3 style={{ marginTop: 20 }}>Seat Map</h3>
          <SeatMap roomInfo={roomDetail.room} />

          <Button onClick={handleCancel} style={{ marginTop: 16 }}>
            Close
          </Button>
        </div>
      ) : (
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="cinema"
            label="Cinema"
            rules={[{ required: true, message: "Cinema is required" }]}
          >
            {loadingCinemas ? (
              <Spin size="small" />
            ) : (
              <Select placeholder="Select Cinema">
                {cinemas.map((cinema) => (
                  <Option key={cinema._id} value={cinema._id}>
                    {cinema.name}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item
            name="roomname"
            label="Room Name"
            rules={[{ required: true, message: "Room Name is required" }]}
          >
            <Input placeholder="Enter Room Name" />
          </Form.Item>
          <Form.Item
            name="roomtype"
            label="Room Type"
            rules={[{ required: true, message: "Room Type is required" }]}
          >
            <Select placeholder="Select Room Type">
              <Option value="Standard">Standard</Option>
              <Option value="IMAX">IMAX</Option>
              <Option value="4DX">4DX</Option>
              <Option value="Dolby">Dolby</Option>
              <Option value="ScreenX">ScreenX</Option>
            </Select>
          </Form.Item>
          <Form.Item name="row" label="Number of Rows">
            <Input type="number" min={1} max={300} />
          </Form.Item>
          <Form.Item name="colum" label="Number of Columns">
            <Input type="number" min={1} max={300} />
          </Form.Item>
          <div className="modalFooter">
            <Button onClick={handleCancel} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {editingRoom ? "Save Changes" : "Create Room"}
            </Button>
          </div>
        </Form>
      )}
    </Modal>
  );
};

export default RoomForm;
