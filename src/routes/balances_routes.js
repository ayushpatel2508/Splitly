import express from "express";
const router = express.Router();
import { getBalances } from "../controllers/balanceController.js";
import isLoggedIn from "../middlewares/isLoggedIn.js";

router.get("/", isLoggedIn, getBalances);

export default router;
