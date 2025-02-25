import {
  fetchMovieTypes,
  fetchMovies,
  createOrUpdateMovie,
  deleteMovie,
  DetailMovie,
} from "../../components/api/movieApi";
import { createSeat } from "../../components/api/seat";
import { notification } from "antd";

export const loadMoviesAndMovieTypes = async (
  setMovieTypes,
  setMovies,
  setLoadingMovieTypes,
  token
) => {
  try {
    const movieTypesData = await fetchMovieTypes();
    const moviesData = await fetchMovies(token);

    setMovieTypes(movieTypesData);
    setMovies(moviesData);
  } catch (error) {
    console.error("Error loading movies & movieTypes:", error);
  } finally {
    setLoadingMovieTypes(false);
  }
};

export const handleDeleteMovie = async (movieId, setMovies, token) => {
  if (!token) {
    return notification.error({
      message: "Unauthorized",
      description: "You are not authorized to delete a movie.",
    });
  }
  try {
    await deleteMovie(token, movieId);
    const updatedMovies = await fetchMovies(token);
    setMovies(updatedMovies);
    notification.success({ message: "Movie deleted successfully!" });
  } catch (error) {
    console.error("Error deleting movie:", error);
    notification.error({ message: "Error deleting movie!" });
  }
};

export const handleDetailMovie = async (
  movieId,
  setMovieDetail,
  setIsFormVisible,
  token
) => {
  if (!token) {
    return notification.error({
      message: "Unauthorized",
      description: "You are not authorized to view movie details.",
    });
  }
  try {
    const detail = await DetailMovie(token, movieId);
    setMovieDetail(detail);
    setIsFormVisible(true);
  } catch (error) {
    console.error("Error fetching movie details:", error);
    notification.error({
      message: "Failed to load movie details",
      description: "An error occurred while fetching details.",
    });
  }
};

const createSeatsForMovie = async (movieId, values) => {
  if (!movieId) {
    console.error("Movie ID is missing!");
    return;
  }
  try {
    await createSeat({
      movie: movieId,
      column: values.colum,
      row: values.row,
    });
  } catch (error) {
    console.error("Error creating seats:", error);
  }
};

export const handleMovieSubmit = async (
  values,
  auth,
  editingMovie,
  setMovies,
  setIsFormVisible,
  setEditingMovie
) => {
  if (!auth.token) {
    return notification.error({
      message: "Unauthorized",
      description: "You are not authorized to create or update a movie.",
    });
  }
console.log(values)
  try {
    const formData = new FormData();
    formData.append("movieType", values.movieType);
    formData.append("name", values.name);
    formData.append("length", Number.parseInt(values.length));
    formData.append("actor", values.actor);
    formData.append("description", values.description);

    if (values.img && values.img instanceof File) {
      formData.append("img", values.img);
    }

    if (values.trailer && values.trailer instanceof File) {
      formData.append("trailer", values.trailer);
    }

    const movieData = await createOrUpdateMovie(auth.token, formData, editingMovie);
    const movieId = editingMovie ? editingMovie._id : movieData.data._id;

    await createSeatsForMovie(movieId, values);
    const updatedMovies = await fetchMovies(auth.token);
    
    setMovies(updatedMovies);
    setIsFormVisible(false);
    setEditingMovie(null);

    notification.success({ message: "Movie saved successfully!" });
  } catch (error) {
    console.error("Error creating/updating movie:", error);
    notification.error({
      message: "Error",
      description: "Failed to save the movie. Please try again.",
    });
  }
};