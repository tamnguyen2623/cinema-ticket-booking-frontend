import React from "react";
import { Input } from "antd";

export default function BannerFilter({ setSearchTerm }) {
  return (
    <Input
      placeholder="Search banner..."
      onChange={(e) => setSearchTerm(e.target.value)}
      className="searchInput"
      style={{ width: 300 }}
    />
  );
}
