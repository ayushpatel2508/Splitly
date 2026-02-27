import Friend from "../modals/friendsModal.js";

const isFriend = async (req, res, next) => {
  const { friend_id } = req.body;
  const userId = req.user.id;

  if (!friend_id) {
    return res.status(400).json({ message: "friend_id is required" });
  }

  try {
    const areFriends = await Friend.areFriends(userId, friend_id);
    if (!areFriends) {
      return res.status(403).json({ message: "Users are not friends" });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default isFriend;
