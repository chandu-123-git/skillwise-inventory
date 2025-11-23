import { useEffect, useState } from "react";
import ProductsTable from "./components/ProductsTable";
import SearchBar from "./components/SearchBar";
import Sidebar from "./components/Sidebar";

const API_BASE = "https://your-backend-url.onrender.com/api/products";

export default function App() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = async () => {
    const res = await fetch(API_BASE);
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
        <SearchBar onSearch={fetchProducts} />
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
