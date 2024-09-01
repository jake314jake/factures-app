import express from "express";
import { dbGet,dbAll, dbRun } from "../database/connectDB.js";

const router = express.Router();

// GET all products
router.get("/", async (req, res) => {
  try {
    const products = await dbAll("SELECT * FROM Products");
    console.log(products)
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// POST a new product
router.post("/", async (req, res) => {
  const { name, unit_price } = req.body;
  console.log(name)
  console.log(unit_price)
  try {
    const result = await dbRun(
      "INSERT INTO Products (name, unit_price) VALUES (?, ?)",
      [name, unit_price]
    );
    res.status(201).json({ id: result.lastID });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT to update a product by ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, unit_price } = req.body;
  try {
    const result = await dbRun(
      "UPDATE Products SET name = ?, unit_price = ? WHERE id = ?",
      [name, unit_price, id]
    );
    if (result.changes === 0) {
      res.status(404).json({ message: "Product not found" });
    } else {
      res.json({ message: "Product updated successfully" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a product by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await dbRun("DELETE FROM Products WHERE id = ?", [id]);
    if (result.changes === 0) {
      res.status(404).json({ message: "Product not found" });
    } else {
      res.json({ message: "Product deleted successfully" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
