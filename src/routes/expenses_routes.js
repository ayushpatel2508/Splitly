import express from "express";
const router = express.Router();
import { createExpense, getExpenses, deleteExpense } from "../controllers/expenseController.js";
import isLoggedIn from "../middlewares/isLoggedIn.js";

router.use(isLoggedIn);
router.post("/", createExpense);
router.get("/", getExpenses);
router.delete("/:id", deleteExpense);

export default router;
