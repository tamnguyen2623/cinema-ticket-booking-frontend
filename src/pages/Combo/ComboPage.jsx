import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Upload } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, UploadOutlined, SearchOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import "./ComboPage.css";

const ComboPage = () => {
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
            const file = fileList[0].originFileObj || fileList[0];
            console.log("File selected:", file);
            setImageFile(file);
        } else {
            setImageFile(null);
        }
    };

    const handleAddCombo = async () => {
        try {
            const values = await form.validateFields();
            const token = await AsyncStorage.getItem("token");
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("description", values.description);
            formData.append("price", values.price);

            // Kiểm tra xem có file ảnh hay không
            if (imageFile) {
                console.log("Appending image file:", imageFile);
                formData.append("image", imageFile);
            } else {
                console.warn("No image file selected!");
                toast.error("Please select an image before submitting.");
                return; // Dừng hàm nếu không có ảnh
            }

            // Log toàn bộ formData để kiểm tra
            for (let [key, value] of formData.entries()) {
                console.log(`${key}:`, value);
            }

            await axios.post(`/combo`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`
                },
            });

            fetchCombos();
            setModalType(null);
            form.resetFields();
            setImageFile(null);
            toast.success("Combo created successfully!");
        } catch (error) {
            console.error("Lỗi khi thêm combo:", error.response?.data || error);
        }
    };




    const handleEditCombo = async () => {
        try {
            const values = await form.validateFields();
            const token = await AsyncStorage.getItem("token");
            const formData = new FormData();

            formData.append("name", values.name);
            formData.append("description", values.description);
            if (imageFile) {
                formData.append("image", imageFile);
            }

            console.log("FormData Content:");
            formData.forEach((value, key) => console.log(key, value));

            await axios.put(`/combo/${currentCombo._id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${token}`
                }
            });
            fetchCombos();
            setModalType(null);
            setImageFile(null);
            toast.success("Combo updated successfully!");
        } catch (error) {
            console.error("Lỗi khi cập nhật combo:", error);
        }
    };

    const handleDeleteClick = (combo) => {
        Modal.confirm({
            title: "Xác nhận xóa",
            content: `Bạn có chắc chắn muốn xóa combo \"${combo.name}\" không?`,
            okText: "Xác nhận",
            cancelText: "Hủy",
            okType: "danger",
            onOk: () => handleDelete(combo._id),
        });
    };

    const handleDelete = async (id) => {
        try {
            const token = await AsyncStorage.getItem("token");
            await axios.delete(`/combo/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
            });
            fetchCombos();
            toast.success("Combo deleted successfully!");
        } catch (error) {
            console.error("Lỗi khi xóa combo:", error);
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
        { title: "Description", dataIndex: "description", key: "description", width: 300 },
        { title: "Price", dataIndex: "price", key: "price", width: 300 },
        {
            title: "Image",
            dataIndex: "image",
            key: "image",
            render: (image) => <img src={image} alt="combo" style={{ width: 50, height: 50 }} />,
        },
        {
            title: "Action",
            key: "action",
            render: (record) => (
                <div style={{ display: "flex", gap: "10px" }}>
                    <Button type="primary" icon={<EditOutlined />} onClick={() => setCurrentCombo(record) || setModalType("edit")}>
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
                <Input placeholder="Tìm combo..." prefix={<SearchOutlined />} onChange={handleSearch} style={{ width: 300 }} />
                <Button icon={<PlusOutlined />} onClick={() => setModalType("add")}>Thêm Combo</Button>
            </div>
            <Table dataSource={filteredCombos} columns={columns} rowKey="_id" scroll={{ x: 800 }} />
            <Modal
                title={modalType === "add" ? "Thêm Combo Mới" : "Chỉnh Sửa Combo"}
                open={modalType !== null}
                onCancel={() => {
                    setModalType(null);
                    form.resetFields(); // Reset form khi đóng modal
                }}
                onOk={modalType === "add" ? handleAddCombo : handleEditCombo}
                okText="Lưu"
                cancelText="Hủy"
            >
                <Form form={form} layout="vertical" initialValues={{ name: "", description: "" }}>
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
                        rules={[{ required: true, message: "Please enter a price!" }]}
                    >
                        <Input.TextArea />
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
