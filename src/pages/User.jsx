import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  FileOutlined
} from '@ant-design/icons';
import { Button, Form, Input, Modal, Select, Space, Switch, Table, Typography } from 'antd';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { FaFileExport } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const { Title } = Typography;
const { Option } = Select;

const User = () => {
  const { auth } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roles, setRoles] = useState([]);
  const [isRoleModalVisible, setIsRoleModalVisible] = useState(false);
  const [roleForm] = Form.useForm();
  const [isRoleEditing, setIsRoleEditing] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/role/roles/get', {
        headers: { Authorization: `Bearer ${auth.token}` },
      });

      setUsers(response.data.data);
      setFilteredUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get('/role/', {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setRoles(response.data.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);



  // 🔄 Gọi khi component mount

  useEffect(() => {
    fetchUsers();


  }, []);
  // 🔎 Xử lý tìm kiếm
  useEffect(() => {
    const filtered = users.filter(user =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.roleId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => a.isDelete - b.isDelete);
    setFilteredUsers(filtered);
  }
    , [searchTerm, users]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleAddUser = () => {
    form.resetFields();
    setIsEditing(false);
    setIsModalVisible(true);
  };

  const handleEditUser = (user) => {
    form.setFieldsValue({
      username: user.username,
      fullname: user.fullname,
      password: user.password,
      email: user.email,
      roleId: user.roleId?._id
    });
    setEditingUser(user);
    setIsEditing(true);
    setIsModalVisible(true);
  };

  const handleDeleteUser = async (user) => {
    try {
      await axios.put(`/role/deleteEmployee/${user._id}`, { isDelete: !user.isDelete }, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      toast.success("User deleted successfully!", 2);
      await fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user.");
    }
  };


  const handleAddRole = async (values) => {
    try {
      await axios.post('/role/create', values, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      toast.success('Role added successfully!');
      setIsRoleModalVisible(false);
      roleForm.resetFields();
      fetchRoles(); // 🔄 Cập nhật danh sách roles
    } catch (error) {
      console.error('Error adding role:', error);
      toast.error('Failed to add role.');
    }
  };
  const handleFormSubmit = async (values) => {
    console.log("Submitting user data:", values); // Log dữ liệu gửi đi
    try {
      if (isEditing) {
        await axios.put(`/role/putEmployee/${editingUser._id}`, values, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        toast.success("User updated successfully!");
      } else {
        await axios.post("/role/createEmployee", values, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        toast.success("User added successfully!");
      }
      fetchUsers();
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error saving user data:", error.response?.data || error);
      toast.error("Error saving user data");
    }
  };

  const employeeColumns = [
    { title: 'Username', dataIndex: 'username' },
    { title: 'Fullname', dataIndex: 'fullname' },
    { title: 'Email', dataIndex: 'email' },
    {
      title: 'Role',
      dataIndex: 'roleId',
      render: (role) => role?.name || 'N/A',

    },

    {
      title: 'Action',
      render: (_, record) => (
        <Space>
          <Button
            className="custom-edit-btn"
            icon={<EditOutlined />}
            type="primary"
            htmlType="submit"
            block
            onClick={() => handleEditUser(record)}>Edit
          </Button>



        </Space>
      )
    },
    {
      title: "Disabled",
      key: "disabled",
      render: (record) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Switch checked={record.isDelete} className="custom-switch" onChange={() => handleDeleteUser(record)} />
        </div>
      ),
    },
  ];



  const handleExport = async () => {
    try {
      const response = await axios.get(
        `/user/export-customers`,
        {
          headers: {
            "Content-Type":
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            Authorization: `Bearer ${auth.token}`,
          },
          responseType: "blob",
        }
      );

      if (response.status === 200) {
        const url = window.URL.createObjectURL(response.data);
        const link = document.createElement("a");
        link.href = url;
        link.download = "customers.xlsx";
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } else {
        console.error("Failed to download file:", response);
      }
    } catch (error) {
      console.error("Error exporting orders:", error);
    }
  };

  return (
    <div className="container-fluid">
      <div className="title-ticket">User List</div>
      <div className="searchFilterContainer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginRight: '30px' }}>
        <Space>
          <Button type="primary" icon={<FaFileExport />}
            className="custom-edit-btn"
            style={{ fontWeight: "bold" }}

            onClick={handleExport}>
            Export File
          </Button>
          <Input
            placeholder="Search information"
            prefix={<SearchOutlined />}
            style={{ width: 300 }}
            onChange={handleSearch}
            value={searchTerm}
          />
          <Select
            placeholder="Filter role"
            onChange={(value) => {
              if (!value) {
                setFilteredUsers(users); // Nếu không chọn gì thì hiển thị tất cả
              } else {
                setFilteredUsers(users.filter(user => user.roleId?._id === value));
              }
            }}
            allowClear
            className="filterSelect"
          >
            {roles.map((role) => (
              <Option key={role._id} value={role._id}>
                {role.name}
              </Option>
            ))}
          </Select>

        </Space>

        <Button type="primary" icon={<PlusOutlined />}
          className="custom-edit-btn"
          style={{ fontWeight: "bold" }}
          onClick={handleAddUser}>
          Add User
        </Button>
      </div>

      <Table
        columns={employeeColumns}
        dataSource={filteredUsers}
        rowKey="_id"
        pagination={{ pageSize: 8 }}
      />
      <Modal
        title={isEditing ? 'Update User' : 'Add User'}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: 'Please input username!' }]}
          >
            <Input placeholder="Enter username" disabled={isEditing} />
          </Form.Item>
          <Form.Item
            name="fullname"
            label="Fullname"
            rules={[{ required: true, message: 'Please input fullname!' }]}
          >
            <Input placeholder="Enter fullname" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={isEditing ? [] : [{ required: true, message: 'Please input password!' }]}
            hidden={isEditing} // Ẩn khi update
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: 'email', message: 'Enter a valid email!' }]}
          >
            <Input placeholder="Enter email" />
          </Form.Item>
          <Form.Item
            name="roleId"
            label="Role"
            rules={[{ required: true, message: "Please select a role!" }]}
          >
            <Select placeholder="Select role" >
              {roles.map((role) => (
                <Option key={role._id} value={role._id}>{role.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {isEditing ? "Update User" : "Add User"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default User;
