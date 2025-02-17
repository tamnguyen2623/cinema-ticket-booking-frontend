import React, { useState, useEffect } from "react";
import { Table, Tag, Button, Popconfirm, Modal, Form, Input, InputNumber, DatePicker } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined} from "@ant-design/icons";
import axios from "axios";
import "./VoucherPage.css";
// import SideBar from "../AdminDashboard/AdminDashboard";

const VoucherPage = () => {
  const [vouchers, setVouchers] = useState([]);
  const [modalType, setModalType] = useState(null);
  const [form] = Form.useForm();
  const [statusFilter, setStatusFilter] = useState(null);
  const [currentVoucher, setCurrentVoucher] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");


  useEffect(() => {
    fetchVouchers();
  }, [statusFilter]);

  const fetchVouchers = async () => {
    try {
      let url = "http://localhost:8080/voucher/list";
      if (statusFilter !== null) {
        url += `?isUsed=${statusFilter}`;
      }
      const response = await axios.get(url);
      setVouchers(response.data.vouchers || response.data);
    } catch (error) {
      console.error("Lỗi khi tải danh sách voucher:", error);
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

      console.log("Dữ liệu gửi đi:", formattedValues);

      await axios.post("http://localhost:8080/voucher/add", formattedValues, {
        headers: { "Content-Type": "application/json" },
      });
      fetchVouchers();
      setModalType(null);
      form.resetFields();
    } catch (error) {
      console.error("Lỗi khi thêm voucher:", error);
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

      await axios.put(`http://localhost:8080/voucher/update/${currentVoucher._id}`, updatedVoucher);
      fetchVouchers();
      setModalType(null);
    } catch (error) {
      console.error("Lỗi khi cập nhật voucher:", error);
    }
  };

  const handleDeleteClick = (voucher) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Bạn có chắc chắn muốn xóa voucher "${voucher.code}" không?`,
      okText: "Xác nhận",
      cancelText: "Hủy",
      okType: "danger",
      onOk: () => handleDelete(voucher._id),
    });
  };

  const handleEditClick = (voucher) => {
    setCurrentVoucher(voucher);
    setModalType("edit");
    form.setFieldsValue({
      code: voucher.code,
      discount: voucher.discount,
      description: voucher.description,
      expiredDate: voucher.expiredDate ? moment(voucher.expiredDate) : null,
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/voucher/delete/${id}`);
      fetchVouchers();
    } catch (error) {
      console.error("Lỗi khi xóa voucher:", error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };


  const filteredVouchers = vouchers.filter((voucher) =>
    voucher.code.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const columns = [
    {
      title: "Mã Voucher",
      dataIndex: "code",
      key: "code",
      width: 250
    },
    {
      title: "Giảm Giá",
      dataIndex: "discount",
      key: "discount",
      render: (discount) => (typeof discount === "number" ? `${discount}%` : "N/A"),
      width: 250
    },
    {
      title: "Ngày Hết Hạn",
      dataIndex: "expiredDate",
      key: "expiredDate",
      render: (date) => (date ? new Date(date).toLocaleDateString("vi-VN") : "N/A"),
      width: 300
    },
    {
      title: "Trạng Thái",
      dataIndex: "isUsed",
      key: "isUsed",
      filters: [
        { text: "Đã sử dụng", value: true },
        { text: "Chưa sử dụng", value: false },
      ],
      onFilter: (value, record) => record.isUsed === value,
      render: (isUsed) =>
        isUsed ? <Tag color="red">Đã sử dụng</Tag> : <Tag color="green">Chưa sử dụng</Tag>,
      width: 300
    },
    {
      title: "Hành Động",
      key: "action",
      render: (record) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Button className="custom-edit-btn" type="primary" icon={<EditOutlined />} onClick={() => handleEditClick(record)}>
            Sửa
          </Button>
          <Button type="primary" danger icon={<DeleteOutlined />} onClick={() => handleDeleteClick(record)}>
          Xóa
        </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="content">
      {/* <SideBar /> */}
      <Input
      placeholder="Tìm theo mã voucher..."
      prefix={<SearchOutlined />}
      onChange={handleSearch}
      style={{ width: 300, marginBottom: 16 }}
    />
      <Button icon={<PlusOutlined />} onClick={() => setModalType("add")} style={{marginLeft: "10px" }}>
        Thêm Voucher
      </Button>
      <Table dataSource={filteredVouchers} columns={columns} rowKey="_id" scroll={{ x: 1200 }}  />
      <Modal
        title={modalType === "add" ? "Thêm Voucher Mới" : "Chỉnh Sửa Voucher"}
        open={modalType !== null}
        onCancel={() => setModalType(null)}
        onOk={modalType === "add" ? handleAddVoucher : handleEditVoucher}
        okText="Lưu"
        cancelText="Hủy"
        okButtonProps={{ className: "custom-ok-btn" }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="code"
            label="Mã Voucher"
            rules={[{ required: true, message: "Vui lòng nhập mã voucher!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="discount"
            label="Giảm Giá (%)"
            rules={[{ required: true, message: "Nhập mức giảm giá!" }]}
          >
            <InputNumber min={1} max={100} addonAfter="%" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô Tả"
            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="expiredDate"
            label="Ngày Hết Hạn"
            rules={[{ required: true, message: "Chọn ngày hết hạn!" }]}
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VoucherPage;
