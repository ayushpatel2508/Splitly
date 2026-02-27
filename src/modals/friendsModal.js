import pool from "../config/db";

const Friend = {
  async add(userId, friendId) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      await client.query(
        "INSERT INTO friends (user_one, user_two) VALUES ($1, $2)",
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
      `SELECT u.id, u.username, u.email 
       FROM users u
       JOIN friends f ON (u.id = f.user_two AND f.user_one = $1) OR (u.id = f.user_one AND f.user_two = $1)
       WHERE u.id != $1`,
      [userId]
    );
    return result.rows;
  },

  async areFriends(userId1, userId2) {
    const result = await pool.query(
      "SELECT id FROM friends WHERE (user_one = $1 AND user_two = $2) OR (user_one = $2 AND user_two = $1)",
      [userId1, userId2]
    );
    return result.rows.length > 0;
  },

  async remove(userId, friendId) {
    const result = await pool.query(
      "DELETE FROM friends WHERE (user_one = $1 AND user_two = $2) OR (user_one = $2 AND user_two = $1)",
      [userId, friendId]
    );
    return result.rowCount > 0;
  },
};

export default Friend;
