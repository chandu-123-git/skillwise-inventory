import { useEffect, useState } from "react";
import ProductsTable from "./components/ProductsTable";
import SearchBar from "./components/SearchBar";
import Sidebar from "./components/Sidebar";

const API_BASE = "https://skillwise-inventory-2zrt.onrender.com/api/products";

export default function App() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = async (search = "") => {
  const endpoint = search
    ? `${API_BASE}/search?name=${search}`
    : API_BASE;

  const res = await fetch(endpoint);
  const data = await res.json();
  setProducts(data);
};


  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: "70%" }}>
        <h2>Inventory Management System</h2>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
  <button onClick={() => document.getElementById("fileInput").click()}>
    Import CSV
  </button>

  <button
    onClick={() => {
      window.location.href = `${API_BASE}/export`;
    }}
  >
    Export CSV
  </button>

  <input
    id="fileInput"
    type="file"
    accept=".csv"
    style={{ display: "none" }}
    onChange={async (e) => {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);

      await fetch(`${API_BASE}/import`, {
        method: "POST",
        body: formData,
      });
      fetchProducts();
    }}
  />
</div>

        <SearchBar onSearch={(q) => fetchProducts(q)} />
<select onChange={(e) => fetchProducts(e.target.value)} style={{ marginLeft: 10 }}>
  <option value="">All Categories</option>
  <option value="Electronics">Electronics</option>
  <option value="Grocery">Grocery</option>
  <option value="Clothing">Clothing</option>
</select>

        <ProductsTable
          products={products}
          refresh={fetchProducts}
          selectProduct={setSelectedProduct}
        />
      </div>

      <Sidebar product={selectedProduct} />
    </div>
  );
}
