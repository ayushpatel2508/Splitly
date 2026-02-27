import Expense from "../modals/expensesModal.js";

export const getBalances = async (req, res) => {
  const userId = req.user.id;
  try {
    const balances = await Expense.calculateBalances(userId);
    res.status(200).json(balances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
