import React, { useState, useEffect } from "react";
import { Select } from "antd";
import { getMovies } from "../api/movieApi";

export default function FeedbackFilter({ onFilterChange }) {
  const [options, setOptions] = useState([]);

  const handleChange = (selectedValues) => {
    console.log("Selected movie:", selectedValues);
    onFilterChange(selectedValues);
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const data = await getMovies();
      const formattedOptions = data.map((movie) => ({
        label: movie.name, // Gán label là name của movie
        value: movie._id, // Gán value là _id của movie
      }));
      setOptions([{ label: "All", value: "All" }, ...formattedOptions]);
      console.log([{ label: "All", value: "All" }, ...formattedOptions]);
    } catch (error) {
      console.error("Failed to fetch movies:", error);
    }
  };

  return (
    <Select
      defaultValue="All"
      style={{ width: "30%" }}
      placeholder="Select movie"
      onChange={handleChange}
      options={options}
    />
  );
}
