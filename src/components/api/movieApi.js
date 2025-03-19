import axios from "axios";

const apiUrl = "/movie";

export const fetchMovieTypes = async () => {
  try {
    const response = await axios.get("/movietype");
    return response.data.data;
  } catch (error) {
    throw new Error("Error fetching movies: " + error.message);
  }
};

export const fetchMovies = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await axios.get(`${apiUrl}`);
    return response.data.data || [];
  } catch (error) {
    throw new Error("Error fetching movies: " + error.message);
  }
};

export const getMovies = async () => {
  try {
    const response = await axios.get(`${apiUrl}`);
    return response.data.data || [];
  } catch (error) {
    throw new Error("Error fetching movies: " + error.message);
  }
};

/**
 * 📌 Tạo hoặc cập nhật phòng
 */
export const createOrUpdateMovie = async (token, movieData, editingMovie) => {
  try {
    movieData.length =
        (parseInt(movieData.lengthHr) || 0) * 60 + (parseInt(movieData.lengthMin) || 0);
      const formData = new FormData();
      formData.append("name", movieData.name);
      formData.append("description", movieData.description);
      formData.append("img", movieData.img);
      formData.append("trailer", movieData.trailer);
      formData.append("length", movieData.length);
      formData.append("movieType", movieData.movieType);
      formData.append("actor", movieData.actor);
    let response;
    if (editingMovie) {
      response = await axios.put(`${apiUrl}/${editingMovie._id}`, movieData, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      response = await axios.post(apiUrl, movieData, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    return response.data;
  } catch (error) {
    throw new Error("Error creating/updating movie: " + error.message);
  }
};

/**
 * 📌 Xóa phòng
 */
export const deleteMovie = async (token, movieId, checked) => {
  try {
    const response = await axios.delete(`${apiUrl}/${movieId}?checked=${checked}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw new Error("Error deleting movie: " + error.message);
  }
};

/**
 * 📌 Lấy chi tiết phòng theo ID
 */
export const DetailMovie = async (token, movieId) => {
  try {
    const response = await axios.get(`${apiUrl}/${movieId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  } catch (error) {
    throw new Error("Error fetching movie details: " + error.message);
  }
};
