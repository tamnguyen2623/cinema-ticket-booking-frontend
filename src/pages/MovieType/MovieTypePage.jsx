import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import "./MovieTypePage.css";

const MovieTypePage = () => {
  const [movieTypes, setMovieTypes] = useState([]);
  const [modalType, setModalType] = useState(null);
  const [form] = Form.useForm();
  const [currentMovieType, setCurrentMovieType] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchMovieTypes();
  }, []);

  const fetchMovieTypes = async () => {
    try {
      const response = await axios.get(`/movietype`);
      setMovieTypes(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách loại phim:", error);
    }
  };

  const handleAddMovieType = async () => {
    try {
      const values = await form.validateFields();
      const token = await AsyncStorage.getItem("token");
      // Lấy danh sách loại phim hiện tại
      const response = await axios.get(`/movietype`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const existingMovieTypes = response.data.data || [];
      // Kiểm tra xem tên đã tồn tại chưa
      const isDuplicate = existingMovieTypes.some(movieType => movieType.name.toLowerCase() === values.name.toLowerCase());
      if (isDuplicate) {
        return toast.error("Error", {
          position: "top-center",
          autoClose: 2000,
          pauseOnHover: false,
        });
      }
      // Nếu không trùng, thêm mới
      await axios.post(`/movietype`, { name: values.name }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      fetchMovieTypes();
      setModalType(null);
      form.resetFields();
      toast.success("Created successfully!", {
        position: "top-center",
        autoClose: 2000,
        pauseOnHover: false,
      });
    } catch (error) {
      console.error("Lỗi khi thêm loại phim:", error);
    }
  };


  const handleEditMovieType = async () => {
    try {
      const values = await form.validateFields();
      const token = await AsyncStorage.getItem("token");
      // Nếu tên không thay đổi, không cần kiểm tra
      if (values.name === currentMovieType.name) {
        setModalType(null);
        return;
      }
      // Lấy danh sách loại phim hiện tại
      const response = await axios.get(`/movietype`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const existingMovieTypes = response.data.data || [];
      // Kiểm tra xem tên mới có trùng với loại phim khác không (trừ chính nó)
      const isDuplicate = existingMovieTypes.some(movieType =>
        movieType.name.toLowerCase() === values.name.toLowerCase() &&
        movieType._id !== currentMovieType._id
      );
      if (isDuplicate) {
        return toast.error("Error", {
          position: "top-center",
          autoClose: 2000,
          pauseOnHover: false,
        });
      }
      // Nếu không trùng, cập nhật
      await axios.put(`/movietype/${currentMovieType._id}`, { name: values.name }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      fetchMovieTypes();
      setModalType(null);
      toast.success("Update successfully!", {
        position: "top-center",
        autoClose: 2000,
        pauseOnHover: false,
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật loại phim:", error);
    }
  };


  const handleDeleteClick = (movieType) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Bạn có chắc chắn muốn xóa loại phim "${movieType.name}" không?`,
      okText: "Xác nhận",
      cancelText: "Hủy",
      okType: "danger",
      onOk: () => handleDelete(movieType._id),
    });
  };

  const handleDelete = async (id) => {
    try {
      const token = await AsyncStorage.getItem("token"); // Lấy token từ AsyncStorage
      await axios.delete(`/movietype/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
      });
      fetchMovieTypes();
      toast.success("Delete successfully!", {
        position: "top-center",
        autoClose: 2000,
        pauseOnHover: false,
      });
    } catch (error) {
      console.error("Lỗi khi xóa loại phim:", error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredMovieTypes = movieTypes.filter((movieType) =>
    movieType.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      title: "Tên Loại Phim",
      dataIndex: "name",
      key: "name",
      width: 300,
    },
    {
      title: "Hành Động",
      key: "action",
      render: (record) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Button type="primary" icon={<EditOutlined />} onClick={() => setCurrentMovieType(record) || setModalType("edit")}>
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
      <div className="header">
        <Input placeholder="Tìm theo tên loại phim..." prefix={<SearchOutlined />} onChange={handleSearch} style={{ width: 300 }} />
        <Button icon={<PlusOutlined />} onClick={() => setModalType("add")}>
          Thêm Loại Phim
        </Button>
      </div>
      <Table dataSource={filteredMovieTypes} columns={columns} rowKey="_id" scroll={{ x: 800 }} />
      <Modal title={modalType === "add" ? "Thêm Loại Phim Mới" : "Chỉnh Sửa Loại Phim"} open={modalType !== null} onCancel={() => setModalType(null)} onOk={modalType === "add" ? handleAddMovieType : handleEditMovieType} okText="Lưu" cancelText="Hủy">
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên Loại Phim"
            rules={[{ required: true, message: "Vui lòng nhập tên loại phim!" }]}
          >
            <Input />
          </Form.Item>

        </Form>
      </Modal>
    </div>
  );
};

export default MovieTypePage;
