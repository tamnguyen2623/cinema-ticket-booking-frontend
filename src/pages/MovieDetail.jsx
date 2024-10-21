import React, { useEffect, useState } from "react";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";
import axios from "axios";

const MovieDetail = () => {
  const [movie, setMovie] = useState(null);
  const [isFetchingMoviesDone, setIsFetchingMoviesDone] = useState(false);
  const { id } = useParams();

  const fetchMovieDetail = async () => {
    try {
      setIsFetchingMoviesDone(false);
      const response = await axios.get(`/movie/${id}`);
      setMovie(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetchingMoviesDone(true);
    }
  };

  useEffect(() => {
    fetchMovieDetail();
  }, [id]);

  const videoContainerStyle = {
    position: "relative",
    width: "50%",
    paddingBottom: "28.25%", // 16:9 aspect ratio
    height: 0,
    overflow: "hidden",
    margin: "0 auto", // Center the container horizontally
  };

  const iframeStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    border: 0,
  };

  return (
    <div className="flex min-h-screen flex-col gap-4 bg-gradient-to-br from-indigo-900 to-blue-500 pb-8 text-gray-900 sm:gap-8">
      <Navbar />
      {isFetchingMoviesDone ? (
        <div className="mx-4 flex flex-col rounded-md bg-gradient-to-br from-indigo-200 to-blue-100 p-4 text-gray-900 drop-shadow-md sm:mx-8 sm:p-6">
          <h2 className="text-3xl font-bold">{movie.name}</h2>
          <div className="mt-1 overflow-x-auto sm:mt-3">
            <div className="mx-auto flex w-fit gap-4">
              <img
                src={movie.img}
                alt="Movie Poster"
                style={{ maxWidth: 300, maxHeight: 500 }}
                className="img-fluid rounded"
              />
              <div className="mt-4 text-left">
                <p>
                  <strong>Duration:</strong> {movie.length || "-"} min.
                </p>
                <p>
                  <strong>Description:</strong> {movie.description || "-"}.
                </p>
                <p>
                  <strong>Ticket Price:</strong> {movie.price || 0} VND.
                </p>
              </div>
            </div>
          </div>
          <h2 className="pt-10 text-3xl font-bold">Trailer</h2>
          {/* Flexbox container for proper centering */}
          <div className="flex justify-center items-center mt-6">
            <div style={videoContainerStyle}>
              <iframe
                src={movie.trailer}
                title="Movie Trailer"
                style={iframeStyle}
                frameBorder="0"
                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default MovieDetail;
