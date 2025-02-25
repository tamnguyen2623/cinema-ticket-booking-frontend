import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Button, Spin, Upload } from "antd";
import SeatMap from "../../components/Seat/SeatMap";
import { UploadOutlined } from "@mui/icons-material";

const { Option } = Select;

const MovieForm = ({
  isFormVisible,
  handleCancel,
  onFinish,
  editingMovie,
  movieTypes,
  loadingMovieTypes,
  isSubmitting,
  movieDetail,
}) => {
  const [form] = Form.useForm();
  const [imageFile, setImageFile] = useState(null);
  const [trailerFile, setTrailerFile] = useState(null);
  const handleFileChange = (file, fieldName) => {
    if (file.status !== "removed") {
      form.setFieldsValue({ [fieldName]: file.originFileObj });
    }
  };

  useEffect(() => {
    if (isFormVisible) {
      form.setFieldsValue(
        movieDetail ||
          editingMovie || {
            name: "",
            movieType: undefined,
            length: 0,
            img: null,
            trailer: null,
            description: "",
            actor: "",
          }
      );
    }
  }, [isFormVisible, editingMovie, movieDetail, form]);

  return (
    <Modal
      title={
        movieDetail
          ? "Movie Details"
          : editingMovie
          ? "Edit Movie"
          : "Create Movie"
      }
      open={isFormVisible}
      onCancel={handleCancel}
      footer={null}
      width={movieDetail ? "80%" : "50%"}
    >
      {movieDetail ? (
        <div>
          <p>
            <strong>Movie Name:</strong> {movieDetail.name}
          </p>
          <p>
            <strong>Genre:</strong> {movieDetail.movieType.name}
          </p>
          <p>
            <strong>Length:</strong> {movieDetail.length}
          </p>
          <p>
            <strong>Image:</strong>{" "}
            <img
              src={movieDetail.img}
              alt="Movie"
              style={{ width: 100, height: 100, objectFit: "cover" }}
            />
          </p>
          <p>
            <strong>Trailer:</strong>{" "}
            <video width="150" height="100" controls>
              <source src={movieDetail.trailer} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </p>
          <p>
            <strong>Actor:</strong> {movieDetail.actor}
          </p>
          <p>
            <strong>Description:</strong> {movieDetail.description}
          </p>

          <Button onClick={handleCancel} style={{ marginTop: 16 }}>
            Close
          </Button>
        </div>
      ) : (
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="movieType"
            label="Movie Type"
            rules={[{ required: true, message: "Movie Type is required" }]}
          >
            {loadingMovieTypes ? (
              <Spin size="small" />
            ) : (
              <Select placeholder="Select MovieType">
                {movieTypes.map((movieType) => (
                  <Option key={movieType._id} value={movieType._id}>
                    {movieType.name}
                  </Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item
            name="name"
            label="Movie Name"
            rules={[{ required: true, message: "Movie Name is required" }]}
          >
            <Input placeholder="Enter Movie Name" />
          </Form.Item>
          <Form.Item
            name="length"
            label="Length"
            rules={[{ required: true, message: "Length is required" }]}
          >
            <Input type="number" min={1} max={500} />
          </Form.Item>

          <Form.Item
            name="img"
            label="Poster"
            rules={[{ required: true, message: "Please upload an image" }]}
            valuePropName="file"
            getValueFromEvent={(e) => e && e.fileList?.[0]?.originFileObj}
          >
            <Upload
              accept="image/*"
              showUploadList={true}
              maxCount={1} // Chỉ cho phép chọn 1 file
              beforeUpload={(file) => {
                form.setFieldsValue({ img: file });
                return false; // Ngăn không cho upload ngay lập tức
              }}
            >
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="trailer"
            label="Trailer"
            rules={[{ required: true, message: "Please upload a trailer" }]}
            valuePropName="file"
            getValueFromEvent={(e) => e && e.fileList?.[0]?.originFileObj}
          >
            <Upload
              accept="video/*"
              showUploadList={true}
              maxCount={1}
              beforeUpload={(file) => {
                form.setFieldsValue({ trailer: file });
                console.log(file)
                return false;
              }}
            >
              <Button icon={<UploadOutlined />}>Upload Trailer</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="actor"
            label="Actor"
            rules={[{ required: true, message: "Actor is required" }]}
          >
            <Input placeholder="Enter actor" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: "Description is required" }]}
          >
            <Input placeholder="Enter desciption" />
          </Form.Item>
          <div className="modalFooter">
            <Button onClick={handleCancel} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
              className="custom-edit-btn"
            >
              {editingMovie ? "Save Changes" : "Create Movie"}
            </Button>
          </div>
        </Form>
      )}
    </Modal>
  );
};

export default MovieForm;
