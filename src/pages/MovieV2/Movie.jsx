import React, { useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "../../context/AuthContext";
import MovieList from "./MovieList";
import MovieForm from "./MovieForm";
import {
  loadMoviesAndMovieTypes,
  handleDeleteMovie,
  handleMovieSubmit,
  handleDetailMovie,
} from "./MovieActions";
import "../../components/styles/MovieList.css";
import { Form } from "antd/lib";

const Movie = () => {
  const { auth } = useContext(AuthContext);
  const [movies, setMovies] = useState([]);
  const [movieTypes, setMovieTypes] = useState([]);
  const [loadingMovieTypes, setLoadingMovieTypes] = useState(true);
  const [isFormVisible, setIsFormVisible] = useState(false);
   const [filteredMovies, setFilteredMovies] = useState([]);
  const [editingMovie, setEditingMovie] = useState(null);
  const [movieDetail, setMovieDetail] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [filter, setFilter] = useState("all");
const [searchTerm, setSearchTerm] = useState("");
  const [form] = Form.useForm();

  useEffect(() => {
    loadMoviesAndMovieTypes(
      setMovieTypes,
      setMovies,
      setLoadingMovieTypes,
      auth.token
    );
  }, [auth.token]);

  useEffect(() => {}, [movies]);

  const handleEdit = useCallback((movie) => {
    setEditingMovie(movie);
    setMovieDetail(null);
    setIsFormVisible(true);
  }, []);

  const handleDelete = useCallback(
    (id, checked) => handleDeleteMovie(id, checked, setMovies, auth.token),
    [auth.token]
  );

  const handleDetail = useCallback(
    (id) => handleDetailMovie(id, setMovieDetail, setIsFormVisible, auth.token),
    [auth.token]
  );

  return (
    <div className="movie-container">
      <MovieList
        movies={movies}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleDetail={handleDetail}
        movieTypes={movieTypes}
        handleAddMovie={() => {
          setEditingMovie(null);
          setMovieDetail(null);
          setIsFormVisible(true);
        }}
      />

      <MovieForm
        isFormVisible={isFormVisible}
        handleCancel={() => setIsFormVisible(false)}
        onFinish={(values) =>
          handleMovieSubmit(
            values,
            auth,
            editingMovie,
            setMovies,
            setIsFormVisible,
            setEditingMovie
          )
        }
        editingMovie={editingMovie}
        movieTypes={movieTypes}
        loadingMovieTypes={loadingMovieTypes}
        movieDetail={movieDetail}
      />
    </div>
  );
};

export default Movie;
