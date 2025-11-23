import { useState } from "react";

const API_BASE = "https://your-backend-url/api/products";

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
                <td><input defaultValue={p.stock} type="number" onChange={(e)=>handleChange(e,'stock')} /></td>
                <td><input defaultValue={p.status} onChange={(e)=>handleChange(e,'status')} /></td>
                <td>
                  <button onClick={() => saveUpdate(p.id)}>Save</button>
                  <button onClick={() => setEditId(null)}>Cancel</button>
                </td>
              </>
            ) : (
              <>
                <td>{p.name}</td>
                <td>{p.unit}</td>
                <td>{p.category}</td>
                <td>{p.brand}</td>
                <td>{p.stock}</td>
                <td style={{color: p.stock>0 ? "green" : "red"}}>{p.stock>0 ? "In Stock":"Out of Stock"}</td>
                <td><button onClick={() => setEditId(p.id)}>Edit</button></td>
              </>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
