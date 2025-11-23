import express from "express";
const router = express.Router();

// GET all products
router.get("/", async (req, res) => {
  try {
    const rows = await req.db.all("SELECT * FROM products");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Search products
router.get("/search", async (req, res) => {
  const q = (req.query.name || "").toLowerCase();
  try {
    const rows = await req.db.all(
      "SELECT * FROM products WHERE LOWER(name) LIKE ?",
      [`%${q}%`]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
