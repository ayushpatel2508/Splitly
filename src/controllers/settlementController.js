import Settlement from "../modals/settlementModal.js";

export const createSettlement = async (req, res) => {
  const { to_user, amount, date, note } = req.body;
  const from_user = req.user.id;
  try {
    const settlement = await Settlement.create(from_user, to_user, amount, date, note);
    res.status(201).json(settlement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSettlements = async (req, res) => {
  const userId = req.user.id;
  try {
    const settlements = await Settlement.findByUser(userId);
    res.status(200).json(settlements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
