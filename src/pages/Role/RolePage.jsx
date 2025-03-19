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
import { AuthContext } from '../../context/AuthContext';
import { FaFileExport } from 'react-icons/fa';

const { Title } = Typography;
const { Option } = Select;

const RolePage = () => {
  const { auth } = useContext(AuthContext);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [form] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState("");
  const [roles, setRoles] = useState([]);
  const [isRoleModalVisible, setIsRoleModalVisible] = useState(false);
  const [roleForm] = Form.useForm();
  const [isRoleEditing, setIsRoleEditing] = useState(false);



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
    fetchRoles(); fetchRolesWithUserCount();

  }, []);

  const handleDelete = async (role) => {
    try {
      await axios.put(`/role/delete/${role._id}`, { isDelete: !role.isDelete }, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });

      await fetchRoles(); // Cập nhật lại danh sách từ server

      message.success(`Role ${role.name}  ${role.isDelete ? "vô hiệu hóa" : "Deleted "} success!`);
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái role:", error);
      message.error("Không thể cập nhật trạng thái role.");
    }
  };


  // 👉 Xử lý submit form thêm/sửa role
  const handleRoleFormSubmit = async (values) => {
    console.log("Dữ liệu gửi đi:", values);

    const isDuplicate = roles.some(
      (role) => role.name.trim().toLowerCase() === values.name.trim().toLowerCase()
    );

    if (isDuplicate) {
      message.error('Role này đã tồn tại!');
      return;
    }

    try {
      if (isRoleEditing) {
        // 👉 Sửa role
        await axios.put(`/role/${editingRole._id}`, values, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        message.success('Cập nhật role thành công');
      } else {
        // 👉 Thêm role mới
        await axios.post('/role/create', values, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        message.success('Thêm role thành công');
      }

      fetchRoles(); // Cập nhật danh sách role
      setIsRoleModalVisible(false);
      setIsRoleEditing(false);
      roleForm.resetFields();
    } catch (error) {
      console.error('Lỗi khi lưu role:', error);
      message.error('Không thể lưu role');
    }
  };


  // 👉 Xử lý mở modal để thêm role mới
  const handleAddRole = () => {
    setIsRoleEditing(false);
    setIsRoleModalVisible(true);
    roleForm.resetFields(); // Reset form khi thêm mới
  };

  // 🔎 Xử lý tìm kiếm
  useEffect(() => {
    const filtered = roles.filter(role =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRoles(filtered);
  }, [searchTerm, roles]);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    const filtered = roles.filter(role => role.name.toLowerCase().includes(value));
    setFilteredRoles(filtered); // Cập nhật danh sách roles sau khi lọc
  };
  const roleColumns = [
    { title: "Role Name", dataIndex: "name", key: "name" },
    { title: "Members", dataIndex: "memberCount", key: "memberCount" },
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
                name: record.name
              });
              set(record);
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
          <Switch checked={record.isDelete} className="custom-switch" onChange={() => handleDelete(record)} />
        </div>
      ),
    },
   


  ];

  return (
    <div className="w-full min-h-screen bg-white p-8 rounded-none shadow-none">
      <Title level={2}>Role Management</Title>
      <Space className="mb-4">
       
        <Button type="primary" icon={<PlusOutlined />}
          className="custom-edit-btn"
          onClick={handleAddRole}>
          Add Role
        </Button>
        <Input
          placeholder="Search role"
          prefix={<SearchOutlined />}
          style={{ width: 300 }}
          onChange={handleSearch}
          value={searchTerm}
        />
      </Space>

      {/* 👉 Bảng danh sách Role hiển thị ngay trên giao diện */}
      <Table
        className="mt-4"
        columns={roleColumns}
        dataSource={filteredRoles} // Sử dụng danh sách đã lọc
        rowKey="_id"
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={isRoleEditing ? 'Edit Role' : 'Add Role'}
        open={isRoleModalVisible}
        onCancel={() => {
          setIsRoleModalVisible(false);
          setIsRoleEditing(false);
          roleForm.resetFields();
        }}
        footer={null}
      >
        <Form form={roleForm} layout="vertical" onFinish={handleRoleFormSubmit}>
          <Form.Item
            name="name"
            label="Role Name"
            rules={[{ required: true, message: 'Please enter a role name!' }]}
          >
            <Input placeholder="Enter role name" />
          </Form.Item>
          <Form.Item>
            <Button className="custom-edit-btn" type="primary" htmlType="submit" block>
              {isRoleEditing ? 'Update Role' : 'Add Role'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );

};

export default RolePage;
