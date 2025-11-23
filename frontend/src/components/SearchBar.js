import { useState } from "react";

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("");

  const handleKeyPress = (e) => {
    if (e.key === "Enter") search();
  };

  const search = () => {
    onSearch(query);
  };

  return (
    <div style={{ marginBottom: "10px" }}>
      <input
        placeholder="Search by name..."
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <button onClick={search}>Search</button>
    </div>
  );
}
