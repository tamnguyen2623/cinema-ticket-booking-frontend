import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Table,
  Spin,
  Alert,
  Button,
  Form,
  Input,
  DatePicker,
  Select,
  Modal,
  Upload,
  InputNumber,
  Switch,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  UploadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import moment from "moment";
import "./ComboPage.css";
import { AuthContext } from "../../context/AuthContext"; // Import AuthContext

const ComboPage = () => {
  const { auth } = useContext(AuthContext);
  const [combos, setCombos] = useState([]);
  const [modalType, setModalType] = useState(null);
  const [form] = Form.useForm();
  const [currentCombo, setCurrentCombo] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchCombos();
  }, []);

  const fetchCombos = async () => {
    try {
      const response = await axios.get(`/combo`);
      setCombos(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách combo:", error);
    }
  };

  const handleUploadChange = ({ fileList }) => {
    if (fileList.length > 0) {
      const file = fileList[0].originFileObj;
      console.log("File selected:", file);
      setImageFile(file);
    } else {
      setImageFile(null);
    }
  };
  const checkComboNameExist = async (name) => {
    const comboExists = combos.some(
      (combo) => combo.name.toLowerCase() === name.toLowerCase()
    );
    return comboExists;
  };
  const handleAddCombo = async () => {
    try {
      const values = await form.validateFields();
      const nameExists = await checkComboNameExist(values.name);
      if (nameExists) {
        toast.error("Combo name already exists!");
        return;
      }
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("price", values.price);
      if (imageFile) {
        formData.append("image", imageFile); // Đảm bảo đúng tên trường
      } else {
        toast.error("Please select an image before submitting.");
        return;
      }
      formData.append("image", {
        uri: imageFile.uri || imageFile.path, // Lấy đường dẫn ảnh
        type: imageFile.type || "image/jpeg",
        name:
          imageFile.name || `upload.${imageFile.type.split("/")[1] || "jpg"}`,
      });
      await axios.post(`/combo`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${auth.token}`,
        },
      });

      fetchCombos();
      setModalType(null);
      form.resetFields();
      setImageFile(null);
      toast.success("Combo created successfully!");
    } catch (error) {
      console.error("Error adding combo:", error.response?.data || error);
    }
  };

  const handleEditCombo = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();

      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("price", values.price);

      if (imageFile) {
        formData.append("image", {
          uri: imageFile.uri || imageFile.path,
          type: imageFile.type || "image/jpeg",
          name:
            imageFile.name || `upload.${imageFile.type.split("/")[1] || "jpg"}`,
        });
      }

      await axios.put(`/combo/${currentCombo._id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${auth.token}`,
        },
      });

      fetchCombos();
      setModalType(null);
      setImageFile(null);
      toast.success("Combo updated successfully!");
    } catch (error) {
      console.error("Error updating combo:", error.response?.data || error);
      toast.error("Failed to update combo!");
    }
  };

  const handleDelete = async (id, isDelete) => {
    try {
      await axios.put(`/combo/updateIsDelete/${id}`, { isDelete: !isDelete }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.token}`,
        },
      });
      fetchCombos(); // Cập nhật lại danh sách combo
      toast.success("Combo disabled successfully!");
    } catch (error) {
      console.error("Error disabled combo:", error);
      toast.error("Failed to disabled combo!");
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCombos = combos.filter((combo) =>
    combo.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { title: "Name Combo", dataIndex: "name", key: "name", width: 200 },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 300,
    },
    { title: "Price", dataIndex: "price", key: "price", width: 300 },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <img src={image} alt="combo" style={{ width: 50, height: 50 }} />
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (record) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Button
            className="custom-edit-btn"
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              form.setFieldsValue({
                name: record.name,
                description: record.description,
                price: record.price,
              });
              setCurrentCombo(record);
              setModalType("edit");
            }}
          >
            Update
          </Button>
        </div>
      ),
    },
    {
      title: "Disabled",
      key: "disabled",
      render: (record) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Switch checked={record.isDelete} className="custom-switch" onChange={() => handleDelete(record._id, record.isDelete)} />
        </div>
      ),
    },
  ];

  return (
    <div className="content">
      <div className="searchFilterContainer">
        <div>
          <Input
            placeholder="Search combo..."
            prefix={<SearchOutlined />}
            onChange={handleSearch}
            style={{ width: 300 }}
          />
          {/* <Button icon={<PlusOutlined />} onClick={() => setModalType("add")}>
          Add Combo
        </Button> */}
        </div>
        <div className="buttonAddContainer">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setModalType("add")}
            className="addTicketButton"
          >
            Add Combo
          </Button>
        </div>
      </div>
      <Table
        dataSource={filteredCombos}
        columns={columns}
        rowKey="_id"
        scroll={{ x: 800 }}
      />
      <Modal
        okButtonProps={{ className: "custom-ok-btn" }}
        title={modalType === "add" ? "Add New Combo" : "Update Combo"}
        open={modalType !== null}
        onCancel={() => {
          setModalType(null);
          form.resetFields(); // Reset form khi đóng modal
        }}
        onOk={modalType === "add" ? handleAddCombo : handleEditCombo}
        okText="Save"
        cancelText="Cancel"
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ name: "", description: "" }}
        >
          <Form.Item
            name="name"
            label="Name combo"
            rules={[{ required: true, message: "Please enter a name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Please enter a description!" }]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            rules={[
              ({ getFieldValue }) => ({
                required: true,
                validator(_, value) {
                  if (value === undefined || value === null || value === "") {
                    // return Promise.reject("Please enter a price!");
                  }
                  if (isNaN(value)) {
                    return Promise.reject("Price must be a number!");
                  }
                  if (value <= 0) {
                    return Promise.reject("Price must be a positive number!");
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item name="image" label="Image">
            <Upload
              listType="picture"
              beforeUpload={(file) => {
                console.log("Before Upload File:", file);
                setImageFile(file);
                return false; // Không tự động upload
              }}
              onChange={handleUploadChange}
            >
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ComboPage;
