import { TrashIcon, PencilSquareIcon } from "@heroicons/react/24/solid";

const MovieLists = ({ movies, search, handleDelete, handleUpdate }) => {
  const moviesList = movies?.filter((movie) =>
    movie.name.toLowerCase().includes(search?.toLowerCase() || "")
  );

  return moviesList.length ? (
    <div className="grid grid-cols-1 gap-4 rounded-md bg-gradient-to-br from-indigo-100 to-white p-4 drop-shadow-md sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3">
      {moviesList.map((movie, index) => (
        <div
          key={index}
          className="flex flex-col rounded-lg bg-white drop-shadow-md overflow-hidden"
        >
          <div className="w-full aspect-w-2 aspect-h-3">
            <img
              src={movie.img}
              className="object-cover w-full h-64"
              alt="Movie Poster"
            />
          </div>

          <div className="flex flex-col p-4 gap-2">
            <p className="text-lg font-semibold sm:text-xl">{movie.name}</p>
            <p className="text-sm text-gray-600">🎭 Type: {movie.movieType.name || "Unknown"}</p>
            <p className="text-sm text-gray-600">🎬 Actor: {movie.actor || "Not Available"}</p>
            <p className="text-sm">⏳ Length: {movie.length || "-"} min.</p>
            <p className="text-sm">💰 Ticket Price: {movie.price || "-"} VND</p>
            <p className="text-sm">
              📜 Description:{" "}
              {movie.description
                ? movie.description.length > 50
                  ? `${movie.description.substring(0, 50)}...`
                  : movie.description
                : "No description available"}
            </p>
          </div>

          <div className="flex justify-between p-4">
            <button
              className="flex items-center gap-1 rounded-md bg-green-600 px-3 py-1 text-white hover:bg-green-500"
              onClick={() => handleUpdate(movie)}
            >
              <PencilSquareIcon className="h-5 w-5" /> Update
            </button>
            <button
              className="flex items-center gap-1 rounded-md bg-red-600 px-3 py-1 text-white hover:bg-red-500"
              onClick={() => handleDelete(movie)}
            >
              <TrashIcon className="h-5 w-5" /> Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="text-center text-gray-600">No movies found</div>
  );
};

export default MovieLists;
