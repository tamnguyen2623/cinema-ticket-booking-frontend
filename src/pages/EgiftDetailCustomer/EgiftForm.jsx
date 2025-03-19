import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Spin,
  Upload,
  message,
} from "antd";
import SeatMap from "../../components/Seat/SeatMap";
import { UploadOutlined } from "@mui/icons-material";

const { Option } = Select;

const EgiftForm = ({ isFormVisible, handleCancel, onFinish, isSubmitting }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (isFormVisible) {
      form.setFieldsValue({
        email: "",
        fullName: "",
        message: "",
        balance: 0,
      });
    }
  }, [isFormVisible, form]);

  return (
    <Modal
      title={"Send EGift"}
      open={isFormVisible}
      onCancel={handleCancel}
      footer={null}
      width={"50%"}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="email"
          label="Their email"
          rules={[{ required: true, message: "Email is required" }]}
        >
          <Input placeholder="Enter Email" />
        </Form.Item>
        <Form.Item
          name="fullName"
          label="Their name"
          rules={[{ required: true, message: "Their full name is required" }]}
        >
          <Input placeholder="Enter Message" />
        </Form.Item>
        <Form.Item
          name="message"
          label="Message"
          rules={[{ required: true, message: "Message is required" }]}
        >
          <Input placeholder="Enter Message" />
        </Form.Item>
        <Form.Item
          name="balance"
          label="Balance"
          rules={[{ required: true, message: "Balance is required" }]}
        >
          <Input type="number" min={1} max={2000} />
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
            className="custom-edit-btn"
          >
            {"Gift"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default EgiftForm;
