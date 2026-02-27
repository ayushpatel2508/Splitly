import Friend from "../modals/friendsModal.js";

export const addFriend = async (req, res) => {
  const { friendId } = req.body;
  const userId = req.user.id;
  try {
    const result = await Friend.add(userId, friendId);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFriends = async (req, res) => {
  const userId = req.user.id;
  try {
    const friends = await Friend.findAll(userId);
    res.status(200).json(friends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
