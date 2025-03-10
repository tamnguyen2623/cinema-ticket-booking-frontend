import React, { useState, useEffect, useMemo } from "react";
import { Table, Button, Input, Select } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import "../../components/styles/MovieList.css";

const { Option } = Select;

const MovieList = ({
  movies,
  handleEdit,
  handleDelete,
  handleDetail,
  movieTypes,
  handleAddMovie,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMovieType, setSelectedMovieType] = useState("");
  const filteredMovies = useMemo(() => {
    return movies.filter(
      (movie) =>
        movie.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (selectedMovieType ? movie.movieType._id === selectedMovieType : true)
    );
  }, [movies, searchTerm, selectedMovieType]);

  const columns = [
    { title: "Movie Name", dataIndex: "name", key: "name" },
    {
      title: "Genre",
      dataIndex: "movieType",
      key: "movieType",
      render: (movieType) => movieType?.name || "N/A",
    },
    {
      title: "Image",
      dataIndex: "img",
      key: "img",
      render: (img) => (
        <img src={img} alt="Movie" style={{ width: 100, height: 100, objectFit: "cover" }} />
      ),
    },
    {
      title: "Trailer",
      dataIndex: "trailer",
      key: "trailer",
      render: (trailer) => (
        <video width="150" height="100" controls>
          <source src={trailer} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ),
    },
    {
      title: "Length",
      dataIndex: "length",
      key: "length",
    },
    {
      title: "Actor",
      dataIndex: "actor",
      key: "actor",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
// ✅ Thêm cột Release Date
    {
      title: "Release Date",
      dataIndex: "releaseDate",
      key: "releaseDate",
      render: (date) => new Date(date).toLocaleDateString("vi-VN"), // ✅ Hiển thị ngày
    },
    {
      title: "Actions",
      key: "actions",
      render: (record) => (
        <div className="action-buttons">
          <Button
            type="primary"
            size="small"
            onClick={() => handleDetail(record._id)}
            className="info-btn"
          >
            <InfoCircleOutlined />
          </Button>
          <Button
            type="primary"
            size="small"
            onClick={() => handleEdit(record)}
            className="edit-btn"
          >
            <EditOutlined />
          </Button>
          <Button
            type="danger"
            size="small"
            onClick={() => handleDelete(record._id)}
            className="delete-btn"
          >
            <DeleteOutlined />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="container">
      <div className="title-list">Movies List</div>
      <div className="search-filter-add-container">
        <div className="search-filter-container">
          <Input
            placeholder="Search by Movie Name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <Select
            placeholder="Filter by MovieType"
            value={selectedMovieType}
            onChange={(value) => setSelectedMovieType(value)}
            className="filter-select"
          >
            <Option value="">All MovieTypes</Option>
            {movieTypes.map((movieType) => (
              <Option key={movieType._id} value={movieType._id}>
                {movieType.name}
              </Option>
            ))}
          </Select>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddMovie}
          className="add-movie-button"
        >
          Add Movie
        </Button>
      </div>
      <Table
        className="movie-table"
        dataSource={filteredMovies}
        columns={columns}
        rowKey="_id"
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default MovieList;
