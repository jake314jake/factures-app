import express from "express";
import { dbGet, dbAll, dbRun } from "../database/connectDB.js";

const router = express.Router();

// GET all factures
router.get("/", async (req, res) => {
  try {
    const factures = await dbAll("SELECT * FROM Factures");
    res.json(factures);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET a single facture by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const facture = await dbGet("SELECT * FROM Factures WHERE id = ?", [id]);
    if (facture) {
      res.json(facture);
    } else {
      res.status(404).json({ message: "Facture not found" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new facture
router.post("/", async (req, res) => {
  const { date, total_price } = req.body;
  try {
    const result = await dbRun(
      "INSERT INTO Factures (date, total_price) VALUES (?, ?)",
      [date, total_price]
    );
    res.status(201).json({ id: result.lastID });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT to update a facture by ID
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { date, total_price } = req.body;
  try {
    const result = await dbRun(
      "UPDATE Factures SET date = ?, total_price = ? WHERE id = ?",
      [date, total_price, id]
    );
    if (result.changes === 0) {
      res.status(404).json({ message: "Facture not found" });
    } else {
      res.json({ message: "Facture updated successfully" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a facture by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await dbRun("DELETE FROM Factures WHERE id = ?", [id]);
    if (result.changes === 0) {
      res.status(404).json({ message: "Facture not found" });
    } else {
      res.json({ message: "Facture deleted successfully" });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET total price of a facture by ID (joining FactureProducts and Products)
router.get("/:id/total-price", async (req, res) => {
  const { id } = req.params;
  try {
    const rows = await dbAll(
      `SELECT fp.quantity, p.unit_price 
       FROM FactureProducts fp 
       JOIN Products p ON fp.product_id = p.id 
       WHERE fp.facture_id = ?`, 
       [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ message: "Facture or products not found" });
    }
    
    const totalPrice = rows.reduce((total, row) => {
      return total + (row.quantity * row.unit_price);
    }, 0);

    res.json({ total_price: totalPrice });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
