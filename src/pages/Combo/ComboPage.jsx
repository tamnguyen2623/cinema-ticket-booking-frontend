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

    const handleUploadChange = ({ file }) => {
        console.log("Selected file:", file);
        setImageFile(file.originFileObj);
    };


    const handleAddCombo = async () => {
        try {
            const values = await form.validateFields();
            console.log("Form Values:", values); // Kiểm tra giá trị nhập vào
            const token = await AsyncStorage.getItem("token");
            const formData = new FormData();

            formData.append("name", values.name);
            formData.append("description", values.description);
            if (imageFile) {
                formData.append("image", imageFile);
            }

            await axios.post(`/combo`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            fetchCombos();
            setModalType(null);
            form.resetFields();
            setImageFile(null);
            toast.success("Combo created successfully!");
        } catch (error) {
            console.error("Lỗi khi thêm combo:", error);
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
        { title: "Tên Combo", dataIndex: "name", key: "name", width: 200 },
        { title: "Mô Tả", dataIndex: "description", key: "description", width: 300 },
        {
            title: "Hình Ảnh",
            dataIndex: "image",
            key: "image",
            render: (image) => <img src={image} alt="combo" style={{ width: 50, height: 50 }} />,
        },
        {
            title: "Hành Động",
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
                        label="Tên Combo"
                        rules={[{ required: true, message: "Vui lòng nhập tên combo!" }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="description"
                        label="Mô Tả"
                        rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
                    >
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item name="image" label="Hình Ảnh">
                        <Upload beforeUpload={() => false} listType="picture" onChange={handleUploadChange}>
                            <Button icon={<UploadOutlined />}>Tải lên</Button>
                        </Upload>
                    </Form.Item>
                </Form>
            </Modal>

        </div>
    );
};

export default ComboPage;
