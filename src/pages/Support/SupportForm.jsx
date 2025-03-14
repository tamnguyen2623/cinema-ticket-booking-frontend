import React from "react";
import { Modal, Form, Select, Input } from "antd";
import "../../components/styles/supportStyle.css";

const SupportForm = ({
  isVisible,
  onCancel,
  onSubmit,
  form,
  editingSupport,
}) => {
  return (
    <Modal
      title={editingSupport ? "Edit Support" : "Create Support"}
      open={isVisible}
      onOk={onSubmit}
      onCancel={onCancel}
      okButtonProps={{ className: "addSupportButton" }}
    >
      <Form form={form} layout="vertical" name="supportForm">
        <Form.Item
          name="question"
          label="Question"
          rules={[{ required: true, message: "Please enter a question" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="answer" label="Answer">
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          name="type"
          label="Support Type"
          rules={[{ required: true, message: "Please select a type" }]}
        >
          <Select>
            <Select.Option value="Technical">Technical</Select.Option>
            <Select.Option value="Billing">Billing</Select.Option>
            <Select.Option value="General">General</Select.Option>
            <Select.Option value="Cinema">Cinema</Select.Option>
            <Select.Option value="Online">Online</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SupportForm;
