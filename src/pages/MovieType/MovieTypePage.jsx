import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";
import { Table, Spin, Alert, Button, Form, Input, DatePicker, Select, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import moment from 'moment';
import { AuthContext } from '../../context/AuthContext'; // Import AuthContext

const MovieTypePage = () => {
    const { auth } = useContext(AuthContext);
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
            console.error("Error loading movie category list:", error);
        }
    };

    const handleAddMovieType = async () => {
        try {
            const values = await form.validateFields();
            // Lấy danh sách loại phim hiện tại
            const response = await axios.get(`/movietype`, {
                headers: {
                    Authorization: `Bearer ${auth.token}`
                }
            });
            const existingMovieTypes = response.data.data || [];
            // Kiểm tra xem tên đã tồn tại chưa
            const isDuplicate = existingMovieTypes.some(movieType => movieType.name.toLowerCase() === values.name.toLowerCase());
            if (isDuplicate) {
                return toast.error("Error");
            }
            // Nếu không trùng, thêm mới
            await axios.post(`/movietype`, { name: values.name }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${auth.token}`
                }
            });
            fetchMovieTypes();
            setModalType(null);
            form.resetFields();
            toast.success("Created successfully!");
        } catch (error) {
            console.error("Error adding movie type:", error);
        }
    };


    const handleEditMovieType = async () => {
        try {
            const values = await form.validateFields();
            // Nếu tên không thay đổi, không cần kiểm tra
            if (values.name === currentMovieType.name) {
                setModalType(null);
                return;
            }
            // Lấy danh sách loại phim hiện tại
            const response = await axios.get(`/movietype`, {
                headers: { Authorization: `Bearer ${auth.token}` }
            });
            const existingMovieTypes = response.data.data || [];
            // Kiểm tra xem tên mới có trùng với loại phim khác không (trừ chính nó)
            const isDuplicate = existingMovieTypes.some(movieType =>
                movieType.name.toLowerCase() === values.name.toLowerCase() &&
                movieType._id !== currentMovieType._id
            );
            if (isDuplicate) {
                return toast.error("Movie genre name already exists");
            }
            // Nếu không trùng, cập nhật
            await axios.put(`/movietype/${currentMovieType._id}`, { name: values.name }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${auth.token}`
                }
            });
            fetchMovieTypes();
            setModalType(null);
            toast.success("Update successfully!");
        } catch (error) {
            console.error("Error while updating movie type:", error);
        }
    };


    const handleDeleteClick = (movieType) => {
        Modal.confirm({
            title: "Confirm deletion",
            content: `Are you sure you want to delete this movie type?"${movieType.name}"`,
            okText: "Confirm",
            cancelText: "Cancel",
            okType: "danger",
            onOk: () => handleDelete(movieType._id),
        });
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/movietype/${id}`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${auth.token}`
                },
            });
            fetchMovieTypes();
            toast.success("Delete successfully!");
        } catch (error) {
            console.error("Error while deleting movie type:", error);
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
            title: "Movie Type Name",
            dataIndex: "name",
            key: "name",
            width: 300,
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
                            form.setFieldsValue({ name: record.name }); // Gán giá trị vào form trước khi mở modal
                            setCurrentMovieType(record);
                            setModalType("edit");
                        }}
                    >
                        Update
                    </Button>

                    <Button type="primary" danger icon={<DeleteOutlined />} onClick={() => handleDeleteClick(record)}>
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="content">
            <div className="header">
                <Input
                    placeholder="Search by movie type..."
                    prefix={<SearchOutlined />}
                    onChange={handleSearch}
                    style={{ width: 300 }}
                />
                <Button
                    icon={<PlusOutlined />}
                    onClick={() => setModalType("add")}
                >
                    Add Movie Type
                </Button>
            </div>
            <Table
                dataSource={filteredMovieTypes}
                columns={columns}
                rowKey="_id"
                scroll={{ x: 800 }}
            />
            <Modal
                okButtonProps={{ className: "custom-ok-btn" }}
                title={modalType === "add" ? "Add New Movie Type" : "Update Movie Type"}
                open={modalType !== null}
                onCancel={() => setModalType(null)}
                onOk={modalType === "add" ? handleAddMovieType : handleEditMovieType}
                okText="Save"
                cancelText="Cancel">
                <Form form={form} layout="vertical">
                    <Form.Item
                        name="name"
                        label="Movie Type Name"
                        rules={[{ required: true, message: "Please enter movie type name!" }]}
                    >
                        <Input />
                    </Form.Item>

                </Form>
            </Modal>
        </div>
    );
};

export default MovieTypePage;
