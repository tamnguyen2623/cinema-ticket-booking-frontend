import React, { useEffect } from "react";
import { Table, Button, Switch } from "antd";
import { EditOutlined } from "@ant-design/icons";

export default function BannerTable({ banners, setModalType, setCurrentBanner, updateIsDeleteBanner, fetchBanners }) {
  const handleDisabled = async (id, isDelete) => {
    try {
      await updateIsDeleteBanner(id, { isDelete: !isDelete });
      fetchBanners();
    } catch (error) {
      console.error("Failed to update isDelete status:", error);
    }
  };

  useEffect(() => {
  }, [banners]);

  return (
    <Table
      dataSource={banners}
      rowKey="_id"
      pagination={{ pageSize: 2, showSizeChanger: false }}
      columns={[
        {
          title: "Name",
          dataIndex: "name",
        },
        {
          title: "Image",
          dataIndex: "image",
          render: (image) => (
            <img src={image} alt="banner" style={{ width: 400, height: 150 }} />
          ),
        },
        {
          title: "Action",
          render: (record) => (
            <Button
              className="custom-edit-btn"
              type="primary"
              icon={<EditOutlined />}
              onClick={() => {
                setCurrentBanner(record);
                setModalType("edit");
              }}
            >
              Edit
            </Button>
          ),
        },
        {
          title: "Disabled",
          render: (record) => (
            <Switch
              checked={record.isDelete}
              className="custom-switch"
              onChange={() => handleDisabled(record._id, record.isDelete)}
            />
          ),
        },
      ]}
    />
  );
}
