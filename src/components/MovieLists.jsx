import { TrashIcon } from "@heroicons/react/24/solid";
import { PencilSquareIcon } from "@heroicons/react/24/solid";

const MovieLists = ({ movies, search, handleDelete, handleUpdate }) => {
  const moviesList = movies?.filter((movie) =>
    movie.name.toLowerCase().includes(search?.toLowerCase() || "")
  );

  return !!moviesList.length ? (
    <div className="grid grid-cols-1 gap-4 rounded-md bg-gradient-to-br from-indigo-100 to-white p-4 drop-shadow-md lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 min-[1920px]:grid-cols-5">
      {moviesList.map((movie, index) => {
        return (
          <div
            key={index}
            className="flex min-w-fit flex-grow rounded-md bg-white drop-shadow-md"
          >
            <div className="w-full aspect-w-2 aspect-h-3 rounded-md overflow-hidden drop-shadow-md">
              <img
                src={movie.img}
                className="object-cover w-full h-full"
                alt="Movie Poster"
              />
            </div>

            <div className="flex flex-grow flex-col justify-between p-2">
              <div>
                <p className="text-lg font-semibold sm:text-xl">{movie.name}</p>
                <p>length : {movie.length || "-"} min.</p>
                <p>ticket price : {movie.price || "-"} VND.</p>
                <p>
                  description:{" "}
                  {movie.description
                    ? movie.description.length > 50
                      ? `${movie.description.substring(0, 50)}...`
                      : movie.description
                    : "No description available"}
                </p>
              </div>
              <div>
                <button
                  className="flex w-fit items-center gap-1 self-end rounded-md bg-gradient-to-br from-green-700 to-yellow-600 py-1 pl-2 pr-1.5 text-sm font-medium text-white hover:from-green-600 hover:to-yellow-500"
                  onClick={() => handleUpdate(movie)}
                >
                  Update
                  <PencilSquareIcon className="h-5 w-5" />
                </button>
                <button
                  className="flex w-fit items-center gap-1 self-end rounded-md bg-gradient-to-br from-red-700 to-rose-600 py-1 pl-2 pr-1.5 text-sm font-medium text-white hover:from-red-600 hover:to-rose-500"
                  onClick={() => handleDelete(movie)}
                >
                  DELETE
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  ) : (
    <div>No movies found</div>
  );
};

export default MovieLists;
