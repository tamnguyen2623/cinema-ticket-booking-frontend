import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Spin,
  Upload,
  Card,
  Typography,
  Row,
  Col,
  DatePicker,
} from "antd";
import SeatMap from "../../components/Seat/SeatMap";
import { UploadOutlined } from "@mui/icons-material";
import { use } from "react";
const { Title, Text } = Typography;
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
      if (editingMovie) {
        form.setFieldsValue({
          name: editingMovie.name || "",
          movieType: editingMovie.movieType?._id || "",
          length: editingMovie.length || 0,
          img: null,
          trailer: null,
          description: editingMovie.description || "",
          actor: editingMovie.actor || "",
          releaseDate: editingMovie.releaseDate
            ? new Date(editingMovie.releaseDate).toISOString().split("T")[0]
            : "",
        });
      } else {
        form.resetFields();
      }
    }
  }, [isFormVisible, editingMovie, form]);
  

  console.log(editingMovie)
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
      onCancel={() => {
        form.resetFields();
        handleCancel()}}
      footer={null}
      width={"50%"}
    >
      {movieDetail ? (
        <div
          className="max-w-lg mx-auto bg-gray-50 shadow-md rounded-xl p-6 border border-gray-200"
          hoverable
        >
          <Title level={3} className="text-center text-gray-800">
            {movieDetail.name}
          </Title>

          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={10} className="flex flex-col items-center">
              <img
                src={movieDetail.img}
                alt="Movie"
                className="w-40 h-40 object-cover rounded-lg shadow-sm mb-3"
              />
              <video
                width="160"
                height="100"
                controls
                className="rounded-lg shadow-sm"
              >
                <source src={movieDetail.trailer} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </Col>

            <Col xs={24} md={14}>
              <p className="text-gray-700">
                <Text strong>🎭 Genre:</Text> {movieDetail.movieType.name}
              </p>
              <p className="text-gray-700">
              <Text strong>⏳ Length:</Text> {movieDetail.length} minutes
              </p>
              <p className="text-gray-700">
                <Text strong>🎬 Actor:</Text> {movieDetail.actor}
              </p>
              <p className="text-gray-700">
                <Text strong>📜 Description:</Text> {movieDetail.description}
              </p>
            </Col>
          </Row>

          <div className="text-center mt-6">
            <Button
              type="primary"
              onClick={handleCancel}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md"
            >
              Close
            </Button>
          </div>
        </div>
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          // initialValues={{
          //   name: editingMovie?.name || "",
          //   movieType: editingMovie?.movieType?.name || "",
          //   length: editingMovie?.length || 0,
          //   img: editingMovie?.img || null,
          //   trailer: editingMovie?.trailer || null,
          //   description: editingMovie?.description || "",
          //   actor: editingMovie?.actor || "",
          //   releaseDate: editingMovie?.releaseDate
          //   ? new Date(editingMovie.releaseDate).toISOString().split("T")[0]
          //   : "",
          // }}
        >
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
            rules={[{ required: editingMovie==null, message: "Please upload an image" }]}
            valuePropName="file"
            getValueFromEvent={(e) => e && e.fileList?.[0]?.originFileObj}
          >
            <Upload
              accept="image/*"
              showUploadList={true}
              maxCount={1}
              beforeUpload={(file) => {
                form.setFieldsValue({ img: file });
                return false;
              }}
            >
              <Button icon={<UploadOutlined />}>Upload Image</Button>
            </Upload>
          </Form.Item>
          {editingMovie && editingMovie.img && (
            <Form.Item label="Current Poster"> 
              <img
                src={editingMovie.img}
                alt="Current Movie Poster"
                style={{ width: "100px", height: "100px" }}
              />
            </Form.Item>
          )}
          <Form.Item
            name="trailer"
            label="Trailer"
            rules={[{ required: editingMovie == null, message: "Please upload a trailer" }]}
            valuePropName="file"
            getValueFromEvent={(e) => e && e.fileList?.[0]?.originFileObj}
          >
            <Upload
              accept="video/*"
              showUploadList={true}
              maxCount={1}
              beforeUpload={(file) => {
                form.setFieldsValue({ trailer: file });
                console.log(file);
                return false;
              }}
            >
              <Button icon={<UploadOutlined />}>Upload Trailer</Button>
            </Upload>
          </Form.Item>
          {editingMovie && editingMovie.trailer && (
            <Form.Item label="Current Trailer"> 
                     <video width="150" height="100" controls>
          <source src={editingMovie.trailer} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
            </Form.Item>
          )}

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
          {/* // ✅ Thêm releaseDate */}
          <Form.Item
            label="Release Date"
            name="releaseDate"
            rules={[
              { required: true, message: "Please select a release date" },
            ]}
          >
            <Input type="date" />
          </Form.Item>

          <div className="modalFooter">
            <Button onClick={() => {
              handleCancel();
              form.resetFields();
            }} style={{ marginRight: 8 }}>
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