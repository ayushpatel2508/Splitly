import Expense from "../modals/expensesModal.js";

export const createExpense = async (req, res) => {
  const { description, amount, splits, expense_date } = req.body;
  const paid_by = req.user.id;
  try {
    const expenseId = await Expense.create({ description, amount, paid_by, expense_date }, splits);
    res.status(201).json({ id: expenseId, message: "Expense created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getExpenses = async (req, res) => {
  const userId = req.user.id;
  const { month, year, limit, offset } = req.query;
  try {
    const expenses = await Expense.findByUser(userId, { month, year, limit, offset });
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteExpense = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await Expense.delete(id);
    if (!result) return res.status(404).json({ message: "Expense not found" });
    res.status(200).json({ message: "Expense deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
