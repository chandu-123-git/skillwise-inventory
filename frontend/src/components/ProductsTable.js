import { useState } from "react";

const API_BASE = "https://skillwise-inventory-2zrt.onrender.com/api/products";

export default function ProductsTable({ products, refresh, selectProduct }) {
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({});

  const handleChange = (e, key) => {
    setForm({ ...form, [key]: e.target.value });
  };

  const saveUpdate = async (id) => {
    await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    setEditId(null);
    refresh();
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
    });
    refresh();
  };

  return (
    <table border="1" style={{ width: "100%", marginTop: "10px" }}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Unit</th>
          <th>Category</th>
          <th>Brand</th>
          <th>Stock</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <tr key={p.id} onClick={() => selectProduct(p)}>
            {editId === p.id ? (
              <>
                <td><input defaultValue={p.name} onChange={(e)=>handleChange(e,'name')} /></td>
                <td><input defaultValue={p.unit} onChange={(e)=>handleChange(e,'unit')} /></td>
                <td><input defaultValue={p.category} onChange={(e)=>handleChange(e,'category')} /></td>
                <td><input defaultValue={p.brand} onChange={(e)=>handleChange(e,'brand')} /></td>
                <td><input type="number" defaultValue={p.stock} onChange={(e)=>handleChange(e,'stock')} /></td>
                <td><input defaultValue={p.status} onChange={(e)=>handleChange(e,'status')} /></td>
                <td>
                  <button onClick={(e) => { e.stopPropagation(); saveUpdate(p.id); }}>
                    Save
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); setEditId(null); }}>
                    Cancel
                  </button>
                </td>
              </>
            ) : (
              <>
                <td>{p.name}</td>
                <td>{p.unit}</td>
                <td>{p.category}</td>
                <td>{p.brand}</td>
                <td>{p.stock}</td>
                <td style={{color: p.stock>0 ? "green" : "red"}}>
                  {p.stock>0 ? "In Stock":"Out of Stock"}
                </td>
                <td>
                  <button onClick={(e) => { e.stopPropagation(); setEditId(p.id); }}>
                    Edit
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); deleteProduct(p.id); }}>
                    Delete
                  </button>
                </td>
              </>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
