import React, { useContext, useState, useEffect } from "react";
import { Table, Button, Modal, Upload, Form, Input, Switch } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined, UploadOutlined } from "@ant-design/icons";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";

const EGiftCardPage = () => {
  const [egifts, setEGifts] = useState([]);
  const [filteredEGifts, setFilteredEGifts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalType, setModalType] = useState(null);
  const [currentEGift, setCurrentEGift] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [form] = Form.useForm();
  const { auth } = useContext(AuthContext);

  const fetchEGifts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/egift/egifts");
      if (response.data && Array.isArray(response.data.data)) {
        setEGifts(response.data.data);
        setFilteredEGifts(response.data.data);
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
    fetchEGifts();
  }, []);

  useEffect(() => {
    const filtered = egifts.filter((egift) =>
      egift.name ? egift.name.toLowerCase().includes(searchTerm.toLowerCase()) : false
    );
    setFilteredEGifts(filtered);
  }, [searchTerm, egifts]);

  const handleUpload = async ({ file }) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post("http://localhost:8080/egift/egifts/upload", formData, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setImageUrl(response.data.url);
      toast.success("Tải ảnh lên thành công!");
    } catch (error) {
      toast.error("Lỗi khi tải ảnh lên!");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      values.image = imageUrl;
      if (modalType === "add") {
        await axios.post("http://localhost:8080/egift/egifts", values, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        toast.success("Thêm eGift thành công!");
      } else if (modalType === "edit") {
        await axios.put(`http://localhost:8080/egift/egifts/${currentEGift._id}`, values, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        toast.success("Cập nhật eGift thành công!");
      }
      await fetchEGifts();
      setModalType(null);
      form.resetFields();
      setImageUrl("");
    } catch (error) {
      toast.error("Lỗi khi lưu eGift!");
    }
  };

  const handleEditClick = (egift) => {
    setCurrentEGift(egift);
    setImageUrl(egift.image || "");
    setModalType("edit");
    form.setFieldsValue({ name: egift.name, description: egift.description });
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 200,
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      width: 200,
      render: (text) => text ? <img src={text} alt="eGift" style={{ width: "100px", height: "100px" }} /> : "No Image",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 400,
    },
    {
      title: "Actions",
      key: "action",
      render: (record) => (
        <Button type="primary" icon={<EditOutlined />} onClick={() => handleEditClick(record)}>
          Sửa
        </Button>
      ),
    },
  ];

  return (
    <div className="content">
      <Input
        placeholder="Search eGift..."
        prefix={<SearchOutlined />}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: 300, marginBottom: 16 }}
      />
      <Button icon={<PlusOutlined />} onClick={() => setModalType("add")} style={{ marginLeft: "10px" }}>
        Add eGift
      </Button>
      <Table dataSource={filteredEGifts} columns={columns} rowKey="_id" />

      <Modal
        title={modalType === "add" ? "Thêm eGift Mới" : "Chỉnh Sửa eGift"}
        open={modalType !== null}
        onCancel={() => {
          setModalType(null);
          form.resetFields();
          setImageUrl("");
        }}
        onOk={handleSubmit}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true, message: "Vui lòng nhập tên eGift!" }]}> 
            <Input />
          </Form.Item>
          <Form.Item label="Upload Image">
            <Upload name="file" showUploadList={false} customRequest={handleUpload}>
              <Button icon={<UploadOutlined />} loading={uploading}>Upload File</Button>
            </Upload>
            {imageUrl && (
              <div style={{ marginTop: 10 }}>
                <img src={imageUrl} alt="Uploaded" style={{ width: "100px", height: "100px" }} />
                <Button icon={<DeleteOutlined />} onClick={() => setImageUrl("")} danger style={{ marginLeft: 10 }}>Xóa ảnh</Button>
              </div>
            )}
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}> 
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EGiftCardPage;