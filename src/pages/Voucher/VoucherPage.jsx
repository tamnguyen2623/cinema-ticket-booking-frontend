import React, { useContext, useState, useEffect } from "react";
import { Table, Tag, Button, Switch, Modal, Form, Input, InputNumber, DatePicker } from "antd";
import { EditOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import moment from "moment";
import "./VoucherPage.css";

const VoucherPage = () => {
  const [vouchers, setVouchers] = useState([]);
  const [modalType, setModalType] = useState(null);
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");
  const { auth } = useContext(AuthContext);
  const [currentVoucher, setCurrentVoucher] = useState(null);

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/voucher/list", {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      setVouchers(response.data.vouchers || response.data);
    } catch (error) {
      toast.error("Error fetching vouchers:", error);
    }
  };

  const handleAddVoucher = async () => {
    try {
      const values = await form.validateFields();
      const formattedValues = {
        code: values.code,
        discount: Number(values.discount),
        description: values.description || "",
        expiredDate: values.expiredDate.format("YYYY-MM-DD"),
      };

      await axios.post("http://localhost:8080/voucher/add", formattedValues, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      fetchVouchers();
      setModalType(null);
      form.resetFields();
      toast.success("Voucher created successfully!");
    } catch (error) {
      toast.error("Error adding voucher:", error);
    }
  };

  const handleEditVoucher = async () => {
    try {
      const values = await form.validateFields();
      const updatedVoucher = {
        ...currentVoucher,
        code: values.code,
        discount: Number(values.discount),
        description: values.description,
        expiredDate: values.expiredDate.format("YYYY-MM-DD"),
      };

      await axios.put(`http://localhost:8080/voucher/update/${currentVoucher._id}`, updatedVoucher, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      fetchVouchers();
      setModalType(null);
      toast.success("Voucher updated successfully!");
    } catch (error) {
      toast.error("Error updating voucher:", error);
    }
  };

  const handleToggleDelete = async (id, isDelete) => {
    try {
      await axios.put(
        `http://localhost:8080/voucher/delete/${id}`,
        { isDelete: !isDelete },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      fetchVouchers();
      toast.success("Voucher updated status successfully!");
    } catch (error) {
      toast.error("Error updating voucher status:", error);
    }
  };

  const handleEditClick = (voucher) => {
    setCurrentVoucher(voucher);
    form.setFieldsValue({
      code: voucher.code,
      discount: voucher.discount,
      description: voucher.description,
      expiredDate: voucher.expiredDate ? moment(voucher.expiredDate) : null,
    });
    setModalType("edit");
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredVouchers = vouchers.filter((voucher) =>
    voucher.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      title: "Voucher Code",
      dataIndex: "code",
      key: "code",
      width: 300,
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      render: (discount) => (typeof discount === "number" ? `${discount}%` : "N/A"),
      width: 250,
    },
    {
      title: "Expiration Date",
      dataIndex: "expiredDate",
      key: "expiredDate",
      render: (date) => (date ? new Date(date).toLocaleDateString("en-US") : "N/A"),
      width: 300,
    },
    {
      title: "Status",
      dataIndex: "isUsed",
      key: "isUsed",
      filters: [
        { text: "Used", value: true },
        { text: "Not Used", value: false },
      ],
      onFilter: (value, record) => record.isUsed === value,
      render: (isUsed) =>
        isUsed ? <Tag color="red">Used</Tag> : <Tag color="green">Not Used</Tag>,
      width: 200,
    },
    {
      title: "Actions",
      key: "action",
      render: (record) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Button className="custom-edit-btn" type="primary" icon={<EditOutlined />} onClick={() => handleEditClick(record)}>
            Edit
          </Button>
        </div>
      )
    },
    {
      title: "Disabled",
      key: "action",
      render: (record) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Switch
            checked={record.isDelete}
            onChange={() => handleToggleDelete(record._id, record.isDelete)}
            className="custom-switch"
          />
        </div>
      ),
    },
  ];

  return (
    <div className="content">
      <Input
        placeholder="Search by voucher code..."
        prefix={<SearchOutlined />}
        onChange={handleSearch}
        style={{ width: 300, marginBottom: 16 }}
      />
      <Button icon={<PlusOutlined />} onClick={() => setModalType("add")} style={{ marginLeft: "10px" }}>
        Add Voucher
      </Button>
      <Table dataSource={filteredVouchers} columns={columns} rowKey="_id" scroll={{ x: 1200 }} />
      <Modal
        title={modalType === "add" ? "Add New Voucher" : "Edit Voucher"}
        open={modalType !== null}
        onCancel={() => setModalType(null)}
        onOk={modalType === "add" ? handleAddVoucher : handleEditVoucher}
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
    </div>
  );
};

export default VoucherPage;