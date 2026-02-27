import express from "express";
const router = express.Router();
import { addFriend, getFriends } from "../controllers/friendController.js";
import isLoggedIn from "../middlewares/isLoggedIn.js";

router.use(isLoggedIn);
router.post("/", addFriend);
router.get("/", getFriends);

export default router;
