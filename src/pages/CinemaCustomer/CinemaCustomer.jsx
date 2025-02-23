import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import axios from "axios";

const CinemaCustomer = () => {
  const [cinemas, setCinemas] = useState([]);
  const [filteredCinemas, setFilteredCinemas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalType, setModalType] = useState(null);
  const [currentCinema, setCurrentCinema] = useState(null);
  const [form] = Form.useForm();

  const fetchCinema = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/cinema");
      if (response.data && response.data.data) {
        setCinemas(response.data.data);
        setFilteredCinemas(response.data.data);
      } else {
        throw new Error("API không trả về dữ liệu hợp lệ!");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCinema();
  }, []);

  useEffect(() => {
    const filtered = cinemas.filter(cinema =>
      cinema.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCinemas(filtered);
  }, [searchTerm, cinemas]);

  const handleAddCinema = async () => {
    try {
      const values = await form.validateFields();
      const formattedValues = { name: values.name, address: values.address };
      await axios.post("http://localhost:8080/cinema", formattedValues, {
        headers: { "Content-Type": "application/json" },
      });
      setModalType(null);
      form.resetFields();
      fetchCinema();
    } catch (error) {
      console.error("Lỗi khi thêm cinema:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:8080/cinema/${id}`);
      fetchCinema();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (cinema) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Bạn có chắc chắn muốn xóa Cinema "${cinema.name}" không?`,
      okText: "Xác nhận",
      cancelText: "Hủy",
      okType: "danger",
      onOk: () => handleDelete(cinema._id),
    });
  };

  const handleEditCinema = async () => {
    try {
      const values = await form.validateFields();
      const updatedCinema = { name: values.name, address: values.address };
      await axios.put(`http://localhost:8080/cinema/${currentCinema._id}`, updatedCinema);
      fetchCinema();
      setModalType(null);
      form.resetFields();
    } catch (error) {
      console.error("Lỗi khi cập nhật rạp phim:", error);
    }
  };

  const handleEditClick = (cinema) => {
    setCurrentCinema(cinema);
    setModalType("edit");
    form.setFieldsValue({ name: cinema.name, address: cinema.address });
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p style={{ color: "red" }}>Lỗi: {error}</p>;

  const columns = [
    {
      title: "Name Cinema",
      dataIndex: "name",
      key: "name",
      width: 300,
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      width: 700,
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
      <Input
        placeholder="Search by cinema name..."
        prefix={<SearchOutlined />}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: 300, marginBottom: 16 }}
      />
      <Button icon={<PlusOutlined />} onClick={() => setModalType("add")} style={{ marginLeft: "10px" }}>
        Add Cinema
      </Button>
      <Table dataSource={filteredCinemas} columns={columns} rowKey="_id" />

      <Modal
        title={modalType === "add" ? "Thêm Cinema Mới" : "Chỉnh Sửa Cinema"}
        open={modalType !== null}
        onCancel={() => setModalType(null)}
        onOk={modalType === "add" ? handleAddCinema : handleEditCinema}
        okText="Lưu"
        cancelText="Hủy"
        okButtonProps={{ className: "custom-ok-btn" }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true, message: "Vui lòng nhập tên Cinema!" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Address" rules={[{ required: true, message: "Vui lòng nhập địa chỉ Cinema!" }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CinemaCustomer;
