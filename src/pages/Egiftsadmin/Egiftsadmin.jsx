import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Table, Button, Form, Input, Modal, Upload, Switch } from "antd";
import { EditOutlined, PlusOutlined, UploadOutlined, SearchOutlined } from "@ant-design/icons";
import "./Egiftsadmin.css";
import { AuthContext } from "../../context/AuthContext";

const EgiftAdmin = () => {
  const { auth } = useContext(AuthContext);
  const [egifts, setEgifts] = useState([]);
  const [modalType, setModalType] = useState(null);
  const [form] = Form.useForm();
  const [currentEgift, setCurrentEgift] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchEgifts();
  }, []);

  const fetchEgifts = async () => {
    try {
      const response = await axios.get(`/egift/egifts`);
      setEgifts(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching eGifts:", error);
    }
  };

  const handleUploadChange = ({ fileList }) => {
    if (fileList.length > 0) {
      setImageFile(fileList[0].originFileObj);
    } else {
      setImageFile(null);
    }
  };

  const handleAddEgift = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      if (!imageFile) {
        toast.error("Please select an image before submitting.");
        return;
      }
      formData.append("image", imageFile);

      await axios.post(`/egift/egifts`, formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${auth.token}` },
      });
      fetchEgifts();
      setModalType(null);
      form.resetFields();
      setImageFile(null);
      toast.success("eGift created successfully!");
    } catch (error) {
      console.error("Error adding eGift:", error.response?.data || error);
    }
  };

  
  useEffect(() => {
    if (currentEgift) {
      form.setFieldsValue({
        name: currentEgift.name,
        description: currentEgift.description,
      });
    }
  }, [currentEgift, form]);
  
  const handleEditEgift = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      await axios.put(`/egift/egifts/${currentEgift._id}`, formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${auth.token}` },
      });
      fetchEgifts();
      setModalType(null);
      toast.success("eGift updated successfully!");
    } catch (error) {
      console.error("Error updating eGift:", error.response?.data || error);
      toast.error("Failed to update eGift!");
    }
  };

  const handleDelete = async (id, isDelete) => {
    try {
      await axios.put(`/egift/updateIsDelete/${id}`, { isDelete: !isDelete }, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${auth.token}` },
      });
      fetchEgifts();
      toast.success("eGift status updated successfully!");
    } catch (error) {
      console.error("Error updating eGift status:", error);
      toast.error("Failed to update eGift status!");
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredEgifts = egifts.filter((egift) => egift.name?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="content">
      <div className="searchFilterContainer">
        <div>
          <Input placeholder="Search eGift..." prefix={<SearchOutlined />} onChange={handleSearch} style={{ width: 300 }} />
        </div>
        <div className="buttonAddContainer">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalType("add")}
            className="addTicketButton"
          >
            Add eGift
          </Button>
        </div>
      </div>
      <Table
        dataSource={filteredEgifts}
        columns={[
          { title: "Name", dataIndex: "name", key: "name", width: 200 },
          { title: "Description", dataIndex: "description", key: "description", width: 300 },
          { title: "Image", dataIndex: "image", key: "image", render: (image) => <img src={image} alt="eGift" style={{ width: 50, height: 50 }} /> },
          {
            title: "Action", key: "action", render: (record) => (
              <Button
                className="custom-edit-btn"
                type="primary" icon={<EditOutlined />} onClick={() => {
                  form.setFieldsValue({ name: record.name, description: record.description });
                  setCurrentEgift(record);
                  setModalType("edit");
                }}>
                Update
              </Button>
            )
          },
          {
            title: "Disabled", key: "disabled", render: (record) => (
              <div style={{ display: "flex", gap: "10px" }}>
                <Switch className="custom-switch" checked={record.isDelete} onChange={() => handleDelete(record._id, record.isDelete)} />

              </div>
            )
          },
        ]}
        rowKey="_id"
      />
      <Modal
        okButtonProps={{ className: "custom-ok-btn" }}
        title={modalType === "add" ? "Add New eGift" : "Update eGift"}
        open={modalType !== null}
        onCancel={() => { setModalType(null); form.resetFields(); }}
        onOk={modalType === "add" ? handleAddEgift : handleEditEgift}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[
            { required: true, message: "Please enter a name!" },
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();
                const isDuplicate = egifts.some((egift) => egift.name.toLowerCase() === value.toLowerCase() && egift._id !== currentEgift?._id);
                return isDuplicate ? Promise.reject("This name already exists!") : Promise.resolve();
              }
            }
          ]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true, message: "Please enter a description!" }]}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="image" label="Image">
            <Upload listType="picture" beforeUpload={(file) => { setImageFile(file); return false; }}>
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default EgiftAdmin;
