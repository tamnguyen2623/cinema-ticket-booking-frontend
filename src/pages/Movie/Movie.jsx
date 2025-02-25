import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Loading from "../../components/Loading";
import MovieLists from "../../components/MovieLists";
import Navbar from "../../components/Navbar";
import { AuthContext } from "../../context/AuthContext";
import FormModal from "../../common/form-modal";

const Movie = () => {
  const { auth } = useContext(AuthContext);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const [movies, setMovies] = useState([]);
  const [movieTypes, setMovieTypes] = useState([]);
  const [isFetchingMoviesDone, setIsFetchingMoviesDone] = useState(false);
  const [isAddingMovie, SetIsAddingMovie] = useState(false);
  const [movieId, setMovieId] = useState("");

  const [formValues, setFormValues] = useState({
    name: "",
    price: "",
    description: "",
    length: "",
    img: null,
    trailer: null,
    movieType: "",
    actor: "",
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === "file") {
      setFormValues((prevValues) => ({
        ...prevValues,
        [name]: files[0], // For file inputs like img or trailer
      }));
    } else {
      setFormValues((prevValues) => ({
        ...prevValues,
        [name]: value, // For text inputs like name, price, description, length
      }));
    }
  };

  const checkOTPFormData = () => {
    return {
      title: "Update Movie",
      images: [
        {
          alt: "Poster",
          src: formValues.img,
        },
      ],
      video: [
        {
          src: formValues.trailer,
        },
      ],
      fields: [
        {
          value: formValues.name,
          label: "Name",
          name: "name",
          required: true,
          type: "text",
          onChange: handleChange,
        },
        {
          value: formValues.price,
          label: "Price",
          name: "price",
          type: "number",
          required: true,
          onChange: handleChange,
        },
        {
          value: formValues.description,
          label: "Description",
          name: "description",
          required: true,
          type: "text",
          onChange: handleChange,
        },
        {
          value: formValues.length,
          label: "Length (min.):",
          name: "length",
          type: "number",
          required: true,
          onChange: handleChange,
        },
        {
          label: "New poster:",
          name: "img",
          type: "file",
          onChange: handleChange,
        },
        {
          label: "New trailer:",
          name: "trailer",
          type: "file",
          onChange: handleChange,
        },
      ],
    };
  };

  const fetchMovies = async (data) => {
    try {
      setIsFetchingMoviesDone(false);
      const response = await axios.get("/movie");
      reset();
      setMovies(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetchingMoviesDone(true);
    }
  };
  const fetchMovieTypes = async (data) => {
    try {
      setIsFetchingMoviesDone(false);
      const response = await axios.get("/movietype");
      reset();
      setMovieTypes(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetchingMoviesDone(true);
    }
  };

  useEffect(() => {
    fetchMovies();
    fetchMovieTypes();
  }, []);

  const onAddMovie = async (data) => {
    try {
      data.length =
        (parseInt(data.lengthHr) || 0) * 60 + (parseInt(data.lengthMin) || 0);
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("img", data.img[0]);
      formData.append("trailer", data.trailer[0]);
      formData.append("length", data.length);
      formData.append("movieType", data.movieType);
      formData.append("actor", data.actor);
      SetIsAddingMovie(true);
      const response = await axios.post("/movie", formData, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      // console.log(response.data)
      fetchMovies();
      toast.success("Add movie successful!", {
        position: "top-center",
        autoClose: 2000,
        pauseOnHover: false,
      });
    } catch (error) {
      console.error(error);
      toast.error("Error", {
        position: "top-center",
        autoClose: 2000,
        pauseOnHover: false,
      });
    } finally {
      SetIsAddingMovie(false);
    }
  };

  const handleDelete = (movie) => {
    const confirmed = window.confirm(
      `Do you want to delete movie ${movie.name}, including its showtimes and tickets?`
    );
    if (confirmed) {
      onDeleteMovie(movie._id);
    }
  };

  useEffect(() => {
    console.log(movieId), console.log(formValues);
  }, [movieId, formValues]);

  const handleShowUpdate = (movie) => {
    setMovieId(movie._id);
    setFormValues({
      name: movie.name,
      price: movie.price,
      description: movie.description,
      length: movie.length,
      img: null,
      trailer: null,
    });
    console.log(movie._id);
    console.log(movie);
    setIsFormModalOpen(true);
  };
  const handleFormModalClose = () => {
    setIsFormModalOpen(false);
    setFormValues({
      name: "",
      price: "",
      description: "",
      length: "",
      img: null,
      trailer: null,
    });
  };

  const onUpdateMovie = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();

      // Append updated movie details to FormData
      formData.append("name", formValues.name);
      formData.append("price", formValues.price);
      formData.append("description", formValues.description);
      formData.append("length", formValues.length);

      // Only append file inputs if they are set in formValues
      if (formValues.img) {
        formData.append("img", formValues.img);
      }

      if (formValues.trailer) {
        formData.append("trailer", formValues.trailer);
      }

      console.log(formData);
      const response = await axios.put(`/movie/${movieId}`, formData, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });

      fetchMovies();
      toast.success("Movie updated successfully!", {
        position: "top-center",
        autoClose: 2000,
        pauseOnHover: false,
      });

      // handleFormModalClose();
    } catch (error) {
      console.error(error);
      toast.error("Error updating movie", {
        position: "top-center",
        autoClose: 2000,
        pauseOnHover: false,
      });
    }
  };

  const onDeleteMovie = async (id) => {
    try {
      const response = await axios.delete(`/movie/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      // console.log(response.data)
      fetchMovies();
      toast.success("Delete movie successful!", {
        position: "top-center",
        autoClose: 2000,
        pauseOnHover: false,
      });
    } catch (error) {
      console.error(error);
      toast.error("Error", {
        position: "top-center",
        autoClose: 2000,
        pauseOnHover: false,
      });
    }
  };

  const inputHr = parseInt(watch("lengthHr")) || 0;
  const inputMin = parseInt(watch("lengthMin")) || 0;
  const sumMin = inputHr * 60 + inputMin;
  const hr = Math.floor(sumMin / 60);
  const min = sumMin % 60;

  return (
    <div className="flex min-h-screen flex-col justify-center gap-4 bg-gradient-to-br from-indigo-900 to-blue-500 pb-8 text-gray-900 sm:gap-8">
      <div className="mx-4 flex h-fit flex-col gap-4 rounded-md bg-gradient-to-br from-indigo-200 to-blue-100 p-4 drop-shadow-xl sm:mx-8 sm:p-6">
        <h2 className="text-3xl font-bold text-gray-900">Movie Lists</h2>
        <form
          onSubmit={handleSubmit(onAddMovie)}
          className="flex flex-col items-stretch justify-end gap-x-4 gap-y-2 rounded-md bg-gradient-to-br from-indigo-100 to-white p-4 drop-shadow-md lg:flex-row"
        >
          <div className="flex w-full grow flex-col flex-wrap justify-start gap-4 lg:w-auto">
            <h3 className="text-xl font-bold">Add Movie</h3>
            <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
              <label className="text-lg font-semibold leading-5">Name :</label>
              <input
                type="text"
                required
                className="w-full flex-grow rounded px-3 py-1 font-semibold drop-shadow-sm sm:w-auto"
                {...register("name", {
                  required: true,
                })}
              />
            </div>
            <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
              <label className="text-lg font-semibold leading-5">
                Movie type :
              </label>
              <select
                required
                className="w-full flex-grow rounded px-3 py-1 font-semibold drop-shadow-sm sm:w-auto"
                {...register("movieType", { required: true })}
              >
                <option value="">Select a movie type</option>
                {movieTypes.map((type) => (
                  <option key={type._id} value={type._id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
              <label className="text-lg font-semibold leading-5">Poster:</label>
              <input
                type="file"
                required
                className="w-full flex-grow rounded px-3 py-1 font-semibold drop-shadow-sm sm:w-auto"
                {...register("img", {
                  required: true,
                })}
              />
            </div>
            <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
              <label className="text-lg font-semibold leading-5">
                Trailer:
              </label>
              <input
                type="file"
                required
                className="w-full flex-grow rounded px-3 py-1 font-semibold drop-shadow-sm sm:w-auto"
                {...register("trailer", {
                  required: true,
                })}
              />
            </div>
            <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
              <label className="text-lg font-semibold leading-5">
                Length (hr.):
              </label>
              <input
                type="number"
                min="0"
                max="20"
                maxLength="2"
                className="w-full flex-grow rounded px-3 py-1 font-semibold drop-shadow-sm sm:w-auto"
                {...register("lengthHr")}
              />
            </div>

            <div>
              <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
                <label className="text-lg font-semibold leading-5">
                  Length (min.):
                </label>
                <input
                  type="number"
                  min="0"
                  max="2000"
                  maxLength="4"
                  required
                  className="w-full flex-grow rounded px-3 py-1 font-semibold drop-shadow-sm sm:w-auto"
                  {...register("lengthMin", {
                    required: true,
                  })}
                />
              </div>
              <div className="pt-1 text-right">{`${hr}h ${min}m / ${sumMin}m `}</div>
            </div>
            {/* <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
              <label className="text-lg font-semibold leading-5">Price:</label>
              <input
                type="number"
                required
                className="w-full flex-grow rounded px-3 py-1 font-semibold drop-shadow-sm sm:w-auto"
                {...register("price", {
                  required: true,
                })}
              />
            </div> */}
            <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
              <label className="text-lg font-semibold leading-5">
                Actor:
              </label>
              <input
                type="text"
                required
                className="w-full flex-grow rounded px-3 py-1 font-semibold drop-shadow-sm sm:w-auto"
                {...register("actor", {
                  required: true,
                })}
              />
            </div>
            <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
              <label className="text-lg font-semibold leading-5">
                Description:
              </label>
              <input
                type="text"
                required
                className="w-full flex-grow rounded px-3 py-1 font-semibold drop-shadow-sm sm:w-auto"
                {...register("description", {
                  required: true,
                })}
              />
            </div>
          </div>
          <div className="flex w-full flex-col gap-4 lg:w-auto lg:flex-row">
            <button
              className="w-full min-w-fit items-center rounded-md bg-gradient-to-br from-indigo-600 to-blue-500 px-2 py-1 text-center font-medium text-white drop-shadow-md hover:from-indigo-500 hover:to-blue-500 disabled:from-slate-500 disabled:to-slate-400 lg:w-24 xl:w-32 xl:text-xl"
              type="submit"
              disabled={isAddingMovie}
            >
              {isAddingMovie ? "Processing..." : "ADD +"}
            </button>
          </div>
        </form>
        <div className="relative drop-shadow-sm">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className="h-5 w-5 stroke-2 text-gray-500" />
          </div>
          <input
            type="search"
            className="block w-full rounded-lg border border-gray-300 p-2 pl-10 text-gray-900"
            placeholder="Search movie"
            {...register("search")}
          />
        </div>
        {(isFetchingMoviesDone && movies != null) ? (
          <MovieLists
            movies={movies}
            search={watch("search")}
            handleDelete={handleDelete}
            handleUpdate={handleShowUpdate}
          />
        ) : (
          <Loading />
        )}
      </div>
      {isFormModalOpen && (
        <FormModal
          handleClose={handleFormModalClose}
          open={isFormModalOpen}
          formData={checkOTPFormData()}
          onSubmit={onUpdateMovie}
        />
      )}
    </div>
  );
};

export default Movie;
