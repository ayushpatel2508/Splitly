import pool from "../config/db.js";

const Settlement = {
  async create(from_user, to_user, amount, date, note) {
    const result = await pool.query(
      `INSERT INTO settlements (from_user, to_user, amount, date, note) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [from_user, to_user, amount, date, note]
    );
    return result.rows[0];
  },

  async findByUser(userId) {
    const result = await pool.query(
      `SELECT * FROM settlements WHERE from_user = $1 OR to_user = $1 ORDER BY date DESC`,
      [userId]
    );
    return result.rows;
  },
};

export default Settlement;
