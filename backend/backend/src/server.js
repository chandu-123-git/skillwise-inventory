import express from "express";
import cors from "cors";
import { initDb } from "./db.js";
import productsRouter from "./routes/products.js";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

let db;
initDb().then((database) => {
  db = database;
  app.locals.db = db;

  app.use("/api/products", (req, res, next) => {
    req.db = db;
    next();
  }, productsRouter);

  app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
  });
});
