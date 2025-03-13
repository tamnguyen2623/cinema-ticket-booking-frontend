import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  FileOutlined
} from '@ant-design/icons';
import { Button, Form, Input, Modal, Select, Space, Switch, Table, Typography, message } from 'antd';
import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { FaFileExport } from 'react-icons/fa';
import {  AuthContext } from '../context/AuthContext';

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
  const [isRoleEditing, setIsRoleEditing] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/role/roles/get', {
        headers: { Authorization: `Bearer ${auth.token}` },
      });

           setUsers(response.data.data);
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
  const fetchRolesWithUserCount = async () => {
    try {
      const [rolesResponse, usersResponse] = await Promise.all([
        axios.get("/role", { headers: { Authorization: `Bearer ${auth.token}` } }),
        axios.get("/role/roles/get", { headers: { Authorization: `Bearer ${auth.token}` } }),

      ]);

      const rolesData = rolesResponse.data.data;
      const usersData = usersResponse.data.data;

      // 👉 Đếm số lượng user cho từng role
      const rolesWithCount = rolesData.map(role => {
        const memberCount = usersData.filter(user => user.roleId?._id === role._id).length;
        return { ...role, memberCount };
      });

      setRoles(rolesWithCount); // Cập nhật state roles kèm memberCount
    } catch (error) {
      console.error("Error fetching roles with user count:", error);
    }
  };

  // 🔄 Gọi khi component mount

  useEffect(() => {
    fetchUsers();
    fetchRoles(); fetchRolesWithUserCount();

  }, []);

  const handleDeleteRole = async (role) => {
    if (role.name.trim().toLowerCase() === "admin") {
      message.error('Không thể xoá role "admin"!');
      return; // 👉 Dừng chức năng xoá
    }
    Modal.confirm({
      title: 'Confirm delete',
      content: `Delete role "${role.name}"?`,
      okText: 'Confirm',
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await axios.delete(`/role/delete/${role._id}`, {
            headers: { Authorization: `Bearer ${auth.token}` },
          });
          message.success('Role deleted successfully');
          fetchRoles();
        } catch (error) {
          console.error('Delete error:', error);
          // message.error('Failed to delete role');
          message.success('Role deleted successfully');

        }
      },
    });
  };

  const handleRoleFormSubmit = async (values) => {
    const roleName = values.name.trim().toLowerCase();

    // 🛑 Kiểm tra: Không cho phép "user" hoặc tên role chỉ toàn số
    if (roleName === "user" || /^\d+$/.test(roleName)) {
      message.error('Tên role không hợp lệ! Không được là "user" hoặc chỉ chứa số.');
      return;
    }
    const isDuplicate = roles.some(
      (role) => role.name.trim().toLowerCase() === values.name.trim().toLowerCase()
    );

    if (isDuplicate) {
      message.error('Role name already exists. Please choose a different name.');
      return; // ⛔ Ngừng nếu trùng
    }

    try {
      if (isRoleEditing) {
        await axios.put(`/role/${editingRole._id}`, values, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        message.success('Role updated successfully');
      } else {
        await axios.post('/role/create', values, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        message.success('Role created successfully');
      }

      fetchRoles(); // 🔄 Cập nhật roles
      setIsRoleModalVisible(false);
      setIsRoleEditing(false);
      roleForm.resetFields();
    } catch (error) {
      console.error('Save error:', error);
      message.error('Error saving role');
    }
  };

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
      await axios.put(`/role/deleteEmployee/${user._id}`, { isDelete: !user.isDelete }, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      message.success("User deleted successfully!");
      await fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      message.error("Failed to delete user.");
    }
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

  const employeeColumns = [
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
    <div className="w-full min-h-screen bg-white p-8 rounded-none shadow-none">
      <Title level={2}>User Management</Title>
      <Space className="mb-4">
        <Button type="primary" icon={<FaFileExport/>}
          className="custom-edit-btn"
          onClick={handleExport}>
          Export File
        </Button>
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
       
        
      </Space>
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
