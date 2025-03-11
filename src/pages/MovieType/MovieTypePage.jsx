import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Table, Button, Form, Input, Modal, Switch } from "antd";
import { EditOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { AuthContext } from "../../context/AuthContext";

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
            const response = await axios.get(`/movietype`, {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                },
            });
            const existingMovieTypes = response.data.data || [];
            const isDuplicate = existingMovieTypes.some(
                (movieType) => movieType.name.toLowerCase() === values.name.toLowerCase()
            );
            if (isDuplicate) {
                return toast.error("Movie genre name already exists");
            }
            await axios.post(`/movietype`, { name: values.name }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${auth.token}`,
                },
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
            if (values.name === currentMovieType.name) {
                setModalType(null);
                return;
            }
            const response = await axios.get(`/movietype`, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            const existingMovieTypes = response.data.data || [];
            const isDuplicate = existingMovieTypes.some(
                (movieType) =>
                    movieType.name.toLowerCase() === values.name.toLowerCase() &&
                    movieType._id !== currentMovieType._id
            );
            if (isDuplicate) {
                return toast.error("Movie genre name already exists");
            }
            await axios.put(`/movietype/${currentMovieType._id}`, { name: values.name }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${auth.token}`,
                },
            });
            fetchMovieTypes();
            setModalType(null);
            toast.success("Update successfully!");
        } catch (error) {
            console.error("Error while updating movie type:", error);
        }
    };

    const handleDisable = async (id, isDelete) => {
        try {
            await axios.put(`/movietype/updateIsDelete/${id}`, { isDelete: !isDelete }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${auth.token}`,
                },
            });
            fetchMovieTypes();
            toast.success("Movie type status updated successfully!");
        } catch (error) {
            console.error("Error updating movie type status:", error);
            toast.error("Failed to update movie type status!");
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
                            form.setFieldsValue({ name: record.name });
                            setCurrentMovieType(record);
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
                    <Switch
                        checked={record.isDelete}
                        className="custom-switch"
                        onChange={() => handleDisable(record._id, record.isDelete)}
                    />
                </div>
            ),
        },
    ];

    return (
        <div className="content">
            <div className="searchFilterContainer">
                <div>
                    <Input
                        placeholder="Search by movie type..."
                        prefix={<SearchOutlined />}
                        onChange={handleSearch}
                        style={{ width: 300 }}
                    />
                </div>
                <div className="buttonAddContainer">
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setModalType("add")}
                        className="addTicketButton"
                    >
                        Add Movie Type
                    </Button>
                </div>
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
                cancelText="Cancel"
            >
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
