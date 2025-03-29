import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Table,
  Button,
  Form,
  Input,
  Modal,
  Upload,
  InputNumber,
  Switch,
  Select,
  DatePicker,
} from "antd";
import {
  EditOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { AuthContext } from "../../context/AuthContext";
import moment from "moment";

const promotionAdmin = () => {
  const { auth } = useContext(AuthContext);
  const [promotions, setPromotions] = useState([]);
  const [modalType, setModalType] = useState(null);
  const [form] = Form.useForm();
  const [currentPromotion, setCurrentPromotion] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);



  const fetchPromotions = async () => {
    try {
      const response = await axios.get(`/promotion/admin`, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });

      // console.log(" API Response:", response.data);
      console.log("Tất cả promotions:", promotions);

      // Kiểm tra và lấy đúng dữ liệu
      const promotionsData = response.data?.data || response.data || [];

      if (!Array.isArray(promotionsData)) {
        console.error("API trả về dữ liệu không đúng định dạng:", promotionsData);
        return;
      }

      setPromotions(promotionsData);
    } catch (error) {
      console.error("Lỗi API:", error.response?.data || error);
    }
  };
  useEffect(() => {
    fetchPromotions();
  }, []);

  const handleAddPromotion = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("category", values.category);
      formData.append("dateStart", values.dateStart.format("YYYY-MM-DD"));
      formData.append("dateEnd", values.dateEnd.format("YYYY-MM-DD"));
      if (imageFile) {
        formData.append("image", imageFile);
      } else {
        toast.error("Please select an image before submitting.");
        return;
      }

      await axios.post(`/promotion/admin/add`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${auth.token}`,
        },
      });

      fetchPromotions();
      setModalType(null);
      form.resetFields();
      setImageFile(null);
      toast.success("Promotion added successfully!");
    } catch (error) {
      console.error("Error adding promotion:", error.response?.data || error);
    }
  };



  const handleEditPromotion = async () => {
    try {
      const values = await form.validateFields();
      console.log("Giá trị form:", values);


      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("category", values.category);
      formData.append("dateStart", values.dateStart.format("YYYY-MM-DD"));
      formData.append("dateEnd", values.dateEnd.format("YYYY-MM-DD"));

      if (imageFile) {
        formData.append("image", imageFile);
      }

      await axios.put(`/promotion/admin/update/${currentPromotion._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${auth.token}`,
        },
      });
      console.log("Dữ liệu promotion khi edit:", currentPromotion);

      fetchPromotions();
      setModalType(null);
      setImageFile(null);
      toast.success("Promotion updated successfully!");
    } catch (error) {
      console.error("Error updating promotion:", error);
    }
  };
  useEffect(() => {
    if (currentPromotion) {
      form.setFieldsValue({
        name: currentPromotion.name || "",
        description: currentPromotion.description || "",
        category: currentPromotion.category || "",
        dateStart: currentPromotion.dateStart ? moment(currentPromotion.dateStart) : null,
        dateEnd: currentPromotion.dateEnd ? moment(currentPromotion.dateEnd) : null,
      });
    }
  }, [currentPromotion]);


  const handleDelete = async (id, isDelete) => {
    try {
      const newStatus = isDelete ? "active" : "disabled"; // Kiểm tra API cần status gì
      await axios.put(`/promotion/admin/delete/${id}`, { status: newStatus }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });

      fetchPromotions();
      toast.success("Promotion disable!");
    } catch (error) {
      console.error("Error Promotion disabled: ", error);
    }
  };

  const filteredPromotions = promotions.filter((promotion) =>
    (promotion?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promotion?.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (!selectedCategory || promotion?.category === selectedCategory)
  ).sort((a, b) => a.isDelete - b.isDelete); // Sắp xếp mục bị disable xuống cuối

  

  


  const handleUploadChange = ({ file }) => {
    setImageFile(file);
  };

  const columns = [
    {
      title: "Day start",
      dataIndex: "dateStart",
      key: "dateStart",
      render: (text) => text ? new Date(text).toLocaleDateString("vi-VN") : "N/A",
    },
    {
      title: "Day end",
      dataIndex: "dateEnd",
      key: "dateEnd",
      render: (text) => text ? new Date(text).toLocaleDateString("vi-VN") : "N/A",
    },
    { title: "Title", dataIndex: "name", key: "name" },
    { title: "Category", dataIndex: "category", key: "category" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <img src={image} alt="promotion" style={{ width: 50, height: 50 }} />
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (record) => (
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => {
            form.setFieldsValue({
              title: record.title,
              description: record.description,
              category: record.category,
            });
            setCurrentPromotion(record);
            setModalType("edit");
          }}
        >
          Edit
        </Button>
      ),
    },
    {
      title: "Disabled",
      key: "disabled",
      render: (record) => (
        <Switch checked={record.isDelete} onChange={() => handleDelete(record._id, record.isDelete)} />
      ),
    },
  ];

  return (
    <div className="container-fluid">

      <div className="title-ticket">Promotion Management</div>
      <div className="ticketListContainer">
        <div className="searchFilterContainer">
          <div>

            <Input
              placeholder="Search promotion..."
              onChange={(e) => setSearchTerm(e.target.value)}
              className="searchInput"
              style={{ width: 300 }}
            />
            <Select
              placeholder="Filter by category"
              allowClear
              onChange={(value) => setSelectedCategory(value)}
              style={{ width: 200 }}
            >
              <Select.Option value="Hot Promotion">Hot Promotion</Select.Option>
              <Select.Option value="Gift Movie">Gift Movie</Select.Option>
              <Select.Option value="Event Cinema">Event Cinema</Select.Option>
            </Select>
          </div>

          <div className="buttonAddContainer">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setModalType("add")}
              className="addPromotionButton"
            >
              Add Promotion
            </Button>
          </div>
        </div>
        <Table
          dataSource={filteredPromotions}
          columns={columns}
          rowKey="_id"
        />

      </div>


      <Modal
        title={modalType === "add" ? "Add New Promotion" : "Update Promotion"}
        open={modalType !== null}
        onCancel={() => setModalType(null)}
        onOk={modalType === "add" ? handleAddPromotion : handleEditPromotion}
        okText="Save"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Title" rules={[{ required: true, message: "Please enter a title!" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true, message: "Please enter a description!" }]}>
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="dateStart"
            label="Day start"
            rules={[
              { required: true, message: "Please select a start date!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || !getFieldValue("dateEnd") || value.isBefore(getFieldValue("dateEnd"))) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Start date must be before end date!"));
                },
              }),
            ]}
          >
            <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item
            name="dateEnd"
            label="Day end"
            rules={[
              { required: true, message: "Please select an end date!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || !getFieldValue("dateStart") || value.isAfter(getFieldValue("dateStart"))) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("End date must be after start date!"));
                },
              }),
            ]}
          >
            <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: "Please select a category!" }]}
          >
            <Select placeholder="Select a category">
              <Select.Option value="Hot Promotion">Hot Promotion</Select.Option>
              <Select.Option value="Gift Movie">Gift Movie</Select.Option>
              <Select.Option value="Event Cinema">Event Cinema</Select.Option>
            </Select>
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

export default promotionAdmin;
