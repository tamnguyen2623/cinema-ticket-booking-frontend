import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined
} from '@ant-design/icons';
import { Button, Form, Input, Modal, Select, Space, Table, Typography, message } from 'antd';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';

const { Title } = Typography;
const { Option } = Select;

const RolePage = () => {
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
  const fetchUsers = async () => {
    try {
      const response = await axios.get('/role/roles/get', {
        headers: { Authorization: `Bearer ${auth.token}` },
      });

      const filtered = response.data.data
        .filter(user => user.roleId?.name !== 'user') // 👉 Lọc role "user"
        .map(user => ({
          ...user,
          role: user.roleId?.name || 'N/A',
        }));

      setUsers(filtered);
      setFilteredUsers(filtered);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axios.get("/role", {
        headers: { Authorization: `Bearer ${auth.token}` },
      });

      const filteredRoles = response.data.data.filter(role => role.name !== 'user'); // 👉 Lọc role "user"
      setRoles(filteredRoles);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  // 🔎 Xử lý tìm kiếm
  useEffect(() => {
    const filtered = users.filter(user =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

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
      email: user.email,
      roleId: user.roleId?._id
    });
    setEditingUser(user);
    setIsEditing(true);
    setIsModalVisible(true);
  };

  const handleDeleteUser = async (user) => {
    try {
      await axios.delete(`/role/deleteEmployee/${user._id}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      message.success("User deleted successfully!");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      message.error("Failed to delete user.");
    }
  };

  const handleDeleteClick = (user) => {
    Modal.confirm({
      title: "Confirm delete",
      content: `Do you want to delete "${user.username}"?`,
      okText: "Confirm",
      cancelText: "Cancel",
      okType: "danger",
      onOk: () => handleDeleteUser(user),
    });
  };
  const handleAddRole = async (values) => {
    try {
      await axios.post('/role/create', values, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      message.success('Role added successfully!');
      setIsRoleModalVisible(false);
      roleForm.resetFields();
      fetchRoles(); // 🔄 Cập nhật danh sách roles
    } catch (error) {
      console.error('Error adding role:', error);
      message.error('Failed to add role.');
    }
  };
  const handleFormSubmit = async (values) => {
    try {
      if (isEditing) {
        await axios.put(`/role/putEmployee/${editingUser._id}`, values, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        message.success("User updated successfully!");
      } else {
        await axios.post("/role/createEmployee", values, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        message.success("User added successfully!");
      }
      fetchUsers();
      setIsModalVisible(false);
    } catch (error) {
      console.error("Error saving user data:", error);
      message.error("Error saving user data");
    }
  };

  const columns = [
    { title: 'Username', dataIndex: 'username' },
    { title: 'Fullname', dataIndex: 'fullname' },
    { title: 'Email', dataIndex: 'email' },
    {
      title: 'Role',
      dataIndex: 'role',
      filters: roles.map(role => ({
        text: role.name,
        value: role.name,
      })),
      onFilter: (value, record) => record.role === value,
      render: (role) => role || 'No Role',
    },
    {
      title: 'Action',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => handleEditUser(record)}>Update</Button>
          <Button icon={<DeleteOutlined />} danger onClick={() => handleDeleteClick(record)}>Delete</Button>
        </Space>
      )
    }
  ];

  return (
    <div className="w-full min-h-screen bg-white p-8 rounded-none shadow-none">
      <Title level={2}>Role Management</Title>
      <Space className="mb-4">
        <Button type="primary" icon={<PlusOutlined />}
          className="custom-edit-btn"
          onClick={handleAddUser}>
          Add User
        </Button>
        <Input
          placeholder="Search information"
          prefix={<SearchOutlined />}
          style={{ width: 300 }}
          onChange={handleSearch}
          value={searchTerm}
        />
      </Space><Space className="mb-4">
        {/* <Button type="primary" icon={<PlusOutlined />} onClick={handleAddUser}>
          Add User
        </Button> */}
        <Button type="default" icon={<PlusOutlined />} onClick={() => setIsRoleModalVisible(true)}>
          Add Role
        </Button>
      </Space>
      <Table
        columns={columns}
        dataSource={filteredUsers}
        rowKey="_id"
        pagination={{ pageSize: 8 }}
      />
      <Modal
        title="Add Role"
        visible={isRoleModalVisible}
        onCancel={() => {
          setIsRoleModalVisible(false);
          roleForm.resetFields();
        }}
        footer={null}
      >
        <Form form={roleForm} layout="vertical" onFinish={handleAddRole}>
          <Form.Item
            name="name"
            label="Role Name"
            rules={[{ required: true, message: 'Please input role name!' }]}
          >
            <Input placeholder="Enter role name" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Add Role
            </Button>
          </Form.Item>
        </Form>
      </Modal>
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
            <Select placeholder="Select role">
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

export default RolePage;
