import React, { useContext, useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Switch } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
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
  const { auth } = useContext(AuthContext);

  const fetchCinema = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/cinema");
      if (response.data && Array.isArray(response.data.data)) {
        setCinemas(response.data.data);
        setFilteredCinemas(response.data.data);
      } else {
        throw new Error("API không trả về dữ liệu hợp lệ!");
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCinema();
  }, []);

  useEffect(() => {
    const filtered = cinemas.filter(cinema =>
      cinema.name ? cinema.name.toLowerCase().includes(searchTerm.toLowerCase()) : false
    );
    setFilteredCinemas(filtered);
  }, [searchTerm, cinemas]);

  const handleAddCinema = async () => {
    try {
      const values = await form.validateFields();
      const formattedValues = { name: values.name, address: values.address };
      const response = await axios.post("http://localhost:8080/cinema", formattedValues, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });

      setCinemas([...cinemas, response.data]);
      setFilteredCinemas([...cinemas, response.data]);
      setModalType(null);
      form.resetFields();
      toast.success("Thêm rạp phim thành công!");
    } catch (error) {
      toast.error("Lỗi khi thêm cinema!");
    }
  };

  const handleEditCinema = async () => {
    try {
      const values = await form.validateFields();
      const updatedCinema = { name: values.name, address: values.address };
      await axios.put(`http://localhost:8080/cinema/${currentCinema._id}`, updatedCinema, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });

      setCinemas(cinemas.map(cinema =>
        cinema._id === currentCinema._id ? { ...cinema, ...updatedCinema } : cinema
      ));
      setFilteredCinemas(filteredCinemas.map(cinema =>
        cinema._id === currentCinema._id ? { ...cinema, ...updatedCinema } : cinema
      ));

      setModalType(null);
      form.resetFields();
      toast.success("Cập nhật thành công!");
    } catch (error) {
      toast.error("Lỗi khi cập nhật rạp phim!");
    }
  };

  const handleEditClick = (cinema) => {
    setCurrentCinema(cinema);
    setModalType("edit");
    form.setFieldsValue({ name: cinema.name, address: cinema.address });
  };

  const handleToggleDelete = async (id, isDelete) => {
    try {
      await axios.put(`http://localhost:8080/cinema/${id}`, { isDelete: !isDelete }, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });

      setCinemas(cinemas.map(cinema =>
        cinema._id === id ? { ...cinema, isDelete: !isDelete } : cinema
      ));
      setFilteredCinemas(filteredCinemas.map(cinema =>
        cinema._id === id ? { ...cinema, isDelete: !isDelete } : cinema
      ));

      toast.success("Cập nhật trạng thái thành công!");
    } catch (error) {
      toast.error("Lỗi khi cập nhật trạng thái!");
    }
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
        </div>
      ),
    },
    {
      title: "Disabled",
      key: "action",
      render: (record) => (
        <Switch
          checked={record.isDelete}
          onChange={() => handleToggleDelete(record._id, record.isDelete)}
        />
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
