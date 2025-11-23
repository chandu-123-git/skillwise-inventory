import { useState, useEffect } from "react";

export default function Sidebar({ product }) {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!product) return;
    (async () => {
      const backend = "https://skillwise-inventory-2zrt.onrender.com/api/products";
      const res = await fetch(`${backend}/${product.id}/history`);
      const data = await res.json();
      setHistory(data);
    })();
  }, [product]);

  if (!product) return <div style={{ padding: 20 }}>Select a product</div>;

  return (
    <div style={{ width: "30%", borderLeft: "2px solid black", padding: "10px" }}>
      <h3>Inventory History</h3>
      {history.length === 0 ? (
        <p>No changes yet.</p>
      ) : (
        <ul>
          {history.map(h => (
            <li key={h.id}>
              Old: {h.oldStock}, New: {h.newStock}, {h.timestamp.slice(0,10)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
