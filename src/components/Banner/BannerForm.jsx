import React, { useEffect, useState } from "react";
import { Form, Input, Modal, Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";

export default function BannerForm({
  modalType,
  setModalType,
  currentBanner,
  fetchBanners,
  createBanner,
  updateBanner,
}) {
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState(null);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (modalType === "edit" && currentBanner) {
      form.setFieldsValue({
        name: currentBanner.name,
      });

      // Nếu có ảnh cũ, hiển thị nó
      if (currentBanner.image) {
        setFileList([
          {
            uid: "-1",
            name: "banner.jpg",
            status: "done",
            url: currentBanner.image, // Đường dẫn ảnh cũ
          },
        ]);
      }
    } else {
      form.resetFields();
      setFileList([]); // Xóa danh sách ảnh khi thêm mới
    }
  }, [modalType, currentBanner, form]);

  const handleUploadChange = ({ fileList }) => {
    setFileList(fileList);
    setImageFile(fileList.length > 0 ? fileList[0].originFileObj : null);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();
      formData.append("name", values.name);

      // Nếu chọn ảnh mới thì dùng ảnh mới, không thì giữ ảnh cũ
      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (modalType === "add") {
        await createBanner(formData);
        toast.success("Banner added successfully!");
      } else if (modalType === "edit" && currentBanner) {
        await updateBanner(currentBanner._id, formData);
        toast.success("Banner updated successfully!");
      }

      fetchBanners();
      setModalType(null);
      form.resetFields();
      setImageFile(null);
      setFileList([]);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to save banner!");
    }
  };

  return (
    <Modal
      title={modalType === "add" ? "Add New Banner" : "Edit Banner"}
      open={modalType !== null}
      onCancel={() => setModalType(null)}
      onOk={handleSave}
      okText="Save"
      cancelText="Cancel"
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
          name="image"
          label="Image"
          rules={[
            {required: true,
              validator: (_, value) =>
                fileList.length > 0
                  ? Promise.resolve()
                  : Promise.reject(new Error("Please upload an image!")),
            },
          ]}
        >
          <Upload
            listType="picture"
            beforeUpload={() => false}
            fileList={fileList}
            onChange={handleUploadChange}
          >
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
}
