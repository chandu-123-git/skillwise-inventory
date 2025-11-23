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

// UPDATE product
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, unit, category, brand, stock, status, image } = req.body;

  try {
    const product = await req.db.get("SELECT * FROM products WHERE id = ?", [id]);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const newStock = Number(stock);
    const oldStock = product.stock;

    await req.db.run(
      `UPDATE products SET name=?, unit=?, category=?, brand=?, stock=?, status=?, image=? WHERE id=?`,
      [name, unit, category, brand, newStock, status, image, id]
    );

    if (newStock !== oldStock) {
      await req.db.run(
        `INSERT INTO inventory_logs (productId, oldStock, newStock, changedBy, timestamp)
        VALUES (?, ?, ?, ?, ?)`,
        [id, oldStock, newStock, "admin", new Date().toISOString()]
      );
    }

    const updated = await req.db.get("SELECT * FROM products WHERE id=?", [id]);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update product" });
  }
});

// GET product history
router.get("/:id/history", async (req, res) => {
  const { id } = req.params;
  try {
    const rows = await req.db.all(
      `SELECT * FROM inventory_logs WHERE productId=? ORDER BY timestamp DESC`,
      [id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

import multer from "multer";
import fs from "fs";
import { parse } from "csv-parse";

const upload = multer({ dest: "uploads/" });

router.post("/import", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "File required" });

  const filePath = req.file.path;
  let added = 0;
  let skipped = 0;

  const records = [];

  fs.createReadStream(filePath)
    .pipe(parse({ columns: true, trim: true }))
    .on("data", (row) => records.push(row))
    .on("end", async () => {
      for (const row of records) {
        const existing = await req.db.get(
          "SELECT id FROM products WHERE LOWER(name)=?",
          [row.name?.toLowerCase()]
        );

        if (existing) {
          skipped++;
        } else {
          const stock = Number(row.stock || 0);
          const status = stock > 0 ? "In Stock" : "Out of Stock";
          await req.db.run(
            `INSERT INTO products (name, unit, category, brand, stock, status, image)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              row.name,
              row.unit,
              row.category,
              row.brand,
              stock,
              status,
              row.image || null,
            ]
          );
          added++;
        }
      }

      fs.unlinkSync(filePath);
      res.json({ added, skipped });
    });
});
router.get("/export", async (req, res) => {
  try {
    const rows = await req.db.all("SELECT * FROM products");

    let csv = "name,unit,category,brand,stock,status,image\n";
    rows.forEach((p) => {
      csv += `${p.name},${p.unit},${p.category},${p.brand},${p.stock},${p.status},${p.image || ""}\n`;
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", "attachment; filename=products.csv");
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: "Export failed" });
  }
});

export default router;
