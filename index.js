import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./src/routes/auth_routes.js";
import friendRoutes from "./src/routes/add_friend.js";
import expenseRoutes from "./src/routes/expenses_routes.js";
import settlementRoutes from "./src/routes/settlement_routes.js";
import balanceRoutes from "./src/routes/balances_routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/settlements", settlementRoutes);
app.use("/api/balances", balanceRoutes);

app.get("/", (req, res) => {
  res.send("Lending System API is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
