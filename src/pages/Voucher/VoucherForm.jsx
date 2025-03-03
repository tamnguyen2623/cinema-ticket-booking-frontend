import React from "react";
import { Modal, Form, Input, InputNumber, DatePicker } from "antd";
import moment from "moment";

const VoucherForm = ({ form, modalType, setModalType, handleSubmit }) => {
  return (
    <Modal
      title={modalType === "add" ? "Add New Voucher" : "Edit Voucher"}
      open={modalType !== null}
      onCancel={() => setModalType(null)}
      onOk={handleSubmit}
      okText="Save"
      cancelText="Cancel"
      okButtonProps={{ className: "custom-ok-btn" }}
 
    >
      <Form form={form} layout="vertical">
        <Form.Item name="code" label="Voucher Code" rules={[{ required: true, message: "Please enter voucher code!" }]}>
          <Input />
        </Form.Item>
        <Form.Item name="discount" label="Discount (%)" rules={[{ required: true, message: "Enter discount amount!" }]}>
          <InputNumber min={1} max={100} addonAfter="%" />
        </Form.Item>
        <Form.Item name="expiredDate" label="Expiration Date" rules={[{ required: true, message: "Select expiration date!" }]}>
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default VoucherForm;
