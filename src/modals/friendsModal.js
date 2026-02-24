import pool from "../config/db";

const Friend = {
  async add(userId, friendId) {
    const client = await pool.pool.connect();
    try {
      await client.query("BEGIN");

      await client.query(
        "INSERT INTO friends (user_id, friend_id) VALUES ($1, $2), ($2, $1)",
        [userId, friendId]
      );

      await client.query("COMMIT");
      return { success: true };
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },

  async findAll(userId) {
    const result = await pool.query(
      `SELECT u.id, u.name, u.email 
       FROM users u
       JOIN friends f ON u.id = f.friend_id
       WHERE f.user_id = $1`,
      [userId]
    );
    return result.rows;
  },

  async areFriends(userId1, userId2) {
    const result = await pool.query(
      "SELECT id FROM friends WHERE user_id = $1 AND friend_id = $2",
      [userId1, userId2]
    );
    return result.rows.length > 0;
  },

  async remove(userId, friendId) {
    const result = await pool.query(
      "DELETE FROM friends WHERE (user_id = $1 AND friend_id = $2) OR (user_id = $2 AND friend_id = $1)",
      [userId, friendId]
    );
    return result.rowCount > 0;
  },
};

export default Friend;
