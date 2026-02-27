import express from "express";
const router = express.Router();
import { createSettlement, getSettlements } from "../controllers/settlementController.js";
import isLoggedIn from "../middlewares/isLoggedIn.js";

router.use(isLoggedIn);
router.post("/", createSettlement);
router.get("/", getSettlements);

export default router;
