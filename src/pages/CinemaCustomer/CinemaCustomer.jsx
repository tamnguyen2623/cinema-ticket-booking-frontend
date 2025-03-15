import React, { useContext, useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, Switch } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  InsertRowAboveOutlined,
} from "@ant-design/icons";
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
  const [mapModalVisible, setMapModalVisible] = useState(false);
  const [mapUrl, setMapUrl] = useState("");

  const fetchCinema = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8080/cinema/listforadmin",
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      if (response.data && Array.isArray(response.data.data)) {
        setCinemas(response.data.data);
        setFilteredCinemas(response.data.data);
      } else {
        throw new Error("API did not return valid data!");
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
    const filtered = cinemas.filter((cinema) =>
      cinema.name
        ? cinema.name.toLowerCase().includes(searchTerm.toLowerCase())
        : false
    );
    setFilteredCinemas(filtered);
  }, [searchTerm, cinemas]);

  const handleAddCinema = async () => {
    try {
      const values = await form.validateFields();
      const formattedValues = {
        name: values.name,
        address: values.address,
        phoneNumber: values.phoneNumber,
        map: values.map,
      };

      const response = await axios.post(
        "http://localhost:8080/cinema",
        formattedValues,
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );

      setCinemas([...cinemas, response.data]);
      setFilteredCinemas([...cinemas, response.data]);
      setModalType(null);
      form.resetFields();
      toast.success("Adding cinema successfully!");
      fetchCinema();
    } catch (error) {
      toast.error("Error adding cinema!");
    }
  };

  const handleEditCinema = async () => {
    try {
      const values = await form.validateFields();
      const updatedCinema = {
        name: values.name,
        address: values.address,
        phoneNumber: values.phoneNumber,
        map: values.map,
      };

      await axios.put(
        `http://localhost:8080/cinema/${currentCinema._id}`,
        updatedCinema,
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );

      setCinemas(
        cinemas.map((cinema) =>
          cinema._id === currentCinema._id
            ? { ...cinema, ...updatedCinema }
            : cinema
        )
      );
      setFilteredCinemas(
        filteredCinemas.map((cinema) =>
          cinema._id === currentCinema._id
            ? { ...cinema, ...updatedCinema }
            : cinema
        )
      );

      setModalType(null);
      form.resetFields();
      toast.success("Updated successfully");
    } catch (error) {
      toast.error("Error updating cinema!");
    }
  };

  const handleEditClick = (cinema) => {
    setCurrentCinema(cinema);
    setModalType("edit");
    form.setFieldsValue({
      name: cinema.name,
      address: cinema.address,
      phoneNumber: cinema.phoneNumber,
      map: cinema.map,
    });
  };

  const handleToggleDelete = async (id, isDelete) => {
    try {
      await axios.put(
        `http://localhost:8080/cinema/${id}`,
        { isDelete: !isDelete },
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );

      setCinemas(
        cinemas.map((cinema) =>
          cinema._id === id ? { ...cinema, isDelete: !isDelete } : cinema
        )
      );
      setFilteredCinemas(
        filteredCinemas.map((cinema) =>
          cinema._id === id ? { ...cinema, isDelete: !isDelete } : cinema
        )
      );

      toast.success("Status update successful!");
    } catch (error) {
      toast.error("Error updating status!");
    }
  };

  const handleViewMap = (mapLink) => {
    setMapUrl(mapLink);
    setMapModalVisible(true);
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p style={{ color: "red" }}>Lỗi: {error}</p>;

  const columns = [
    {
      title: "Name Cinema",
      dataIndex: "name",
      key: "name",
      width: 200,
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      width: 300,
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: 200,
    },
    {
      title: "Map",
      dataIndex: "map",
      key: "map",
      width: 200,
      render: (text, record) => (
        <Button
          type="primary"
          className="btn-mapview"
          icon={<InsertRowAboveOutlined />}
          onClick={() => handleViewMap(record.map)}
        >
          View Map
        </Button>
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
            onClick={() => handleEditClick(record)}
          >
            Edit
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
          className="custom-switch"
          onChange={() => handleToggleDelete(record._id, record.isDelete)}
        />
      ),
    },
  ];

  const handleAddClick = () => {
    form.resetFields(); // Reset form trước khi mở modal
    setModalType("add");
  };

  return (
    <div className="content">
      <div className="searchFilterContainer">
        <div>
          <Input
            placeholder="Search by cinema name..."
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 300, marginBottom: 16 }}
          />
        </div>
        <div className="buttonAddContainer">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddClick}
            className="addTicketButton"
          >
            Add Cinema
          </Button>
        </div>
      </div>
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
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter a name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: "Please enter an address!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            label="Phone Number"
            rules={[
              { required: true, message: "Please enter a phone number!" },
              {
                pattern: /^0\d{9}$/,
                message: "Invalid phone number!",
              },
              () => ({
                validator(_, value) {
                  if (!value) return Promise.resolve();
                  let isDuplicate;
                  if (modalType === "add") {
                    isDuplicate = cinemas.some(
                      (cinema) => cinema.phoneNumber === value
                    );
                  } else {
                    const oldPhoneNumber = currentCinema?.phoneNumber;
                    isDuplicate =
                      value !== oldPhoneNumber &&
                      cinemas.some((cinema) => cinema.phoneNumber === value);
                  }

                  return isDuplicate
                    ? Promise.reject(new Error("Phone number already exists!"))
                    : Promise.resolve();
                },
              }),
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="map"
            label="Map URL"
            rules={[
              { required: true, message: "Please enter your a map URL!" },
            ]}
          >
            <Input
              addonAfter={
                <a
                  href="https://www.google.com/maps"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google Map
                </a>
              }
            />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Cinema Location"
        open={mapModalVisible}
        onCancel={() => setMapModalVisible(false)}
        footer={null}
        width={800}
      >
        {mapUrl ? (
          <iframe
            src={mapUrl}
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          ></iframe>
        ) : (
          <p>No map available</p>
        )}
      </Modal>
    </div>
  );
};

export default CinemaCustomer;
