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
  Radio,
} from "antd";

const { Option } = Select;

const PaymentEgiftForm = ({ isFormVisible, handleCancel, onFinish, isSubmitting }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (isFormVisible) {
      form.setFieldsValue({
        cardNumber: "",
        pin: "",
      });
    }
  }, [isFormVisible, form]);

  return (
    <Modal
      title={"Payment By EGift"}
      open={isFormVisible}
      onCancel={handleCancel}
      footer={null}
      width={"50%"}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="cardNumber"
          label="Card number"
          rules={[{ required: true, message: "Card number is required" }]}
        >
          <Input placeholder="Enter card number" />
        </Form.Item>
        <Form.Item
          name="pin"
          label="PIN"
          rules={[{ required: true, message: "PIN is required" }]}
        >
          <Input placeholder="Enter PIN" />
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
            {"Submit"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default PaymentEgiftForm;
