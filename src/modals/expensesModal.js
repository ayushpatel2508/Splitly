import pool from "../config/db";
const Expense = {
  async create(expenseData, splits) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const { description, amount, paid_by, expense_date } = expenseData;

      const expenseResult = await client.query(
        `INSERT INTO expenses (description, amount, paid_by, expense_date) 
         VALUES ($1, $2, $3, $4) 
         RETURNING id`,
        [description, amount, paid_by, expense_date]
      );

      const expenseId = expenseResult.rows[0].id;

      for (let split of splits) {
        await client.query(
          `INSERT INTO expense_splits (expense_id, user_id, share_amount) 
           VALUES ($1, $2, $3)`,
          [expenseId, split.user_id, split.share_amount]
        );
      }

      await client.query("COMMIT");
      return expenseId;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  },

  async findByUser(userId, filters = {}) {
    const { month, year, limit = 100, offset = 0 } = filters;

    let query = `
      SELECT e.*, u.username as paid_by_username
      FROM expenses e
      JOIN users u ON e.paid_by = u.id
      WHERE e.id IN (
        SELECT expense_id FROM expense_splits WHERE user_id = $1
        UNION
        SELECT id FROM expenses WHERE paid_by = $1
      )
    `;

    const params = [userId];
    let paramIndex = 2;

    if (month && year) {
      query += ` AND EXTRACT(MONTH FROM e.expense_date) = $${paramIndex} AND EXTRACT(YEAR FROM e.expense_date) = $${
        paramIndex + 1
      }`;
      params.push(month, year);
      paramIndex += 2;
    }

    query += ` ORDER BY e.expense_date DESC LIMIT $${paramIndex} OFFSET $${
      paramIndex + 1
    }`;
    params.push(limit, offset);

    const result = await pool.query(query, params);
    return result.rows;
  },

  async getSplits(expenseId) {
    const result = await pool.query(
      `SELECT es.*, u.username 
       FROM expense_splits es
       JOIN users u ON es.user_id = u.id
       WHERE es.expense_id = $1`,
      [expenseId]
    );
    return result.rows;
  },

  async delete(id) {
    const result = await pool.query(
      "DELETE FROM expenses WHERE id = $1 RETURNING id",
      [id]
    );
    return result.rows[0];
  },

  async calculateBalances(userId) {
    const result = await pool.query(
      `WITH 
       paid AS (
         SELECT paid_by, SUM(amount) as total_paid
         FROM expenses
         GROUP BY paid_by
       ),
       owed AS (
         SELECT user_id, SUM(share_amount) as total_owed
         FROM expense_splits
         GROUP BY user_id
       ),
       settlements_paid AS (
         SELECT from_user, SUM(amount) as total_settled_paid
         FROM settlements
         GROUP BY from_user
       ),
       settlements_received AS (
         SELECT to_user, SUM(amount) as total_settled_received
         FROM settlements
         GROUP BY to_user
       )
       SELECT 
         u.id,
         u.username,
         COALESCE(p.total_paid, 0) as total_paid,
         COALESCE(o.total_owed, 0) as total_owed,
         COALESCE(sp.total_settled_paid, 0) as total_settled_paid,
         COALESCE(sr.total_settled_received, 0) as total_settled_received,
         COALESCE(p.total_paid, 0) - COALESCE(o.total_owed, 0) - 
         COALESCE(sp.total_settled_paid, 0) + COALESCE(sr.total_settled_received, 0) as net_balance
       FROM users u
       LEFT JOIN paid p ON u.id = p.paid_by
       LEFT JOIN owed o ON u.id = o.user_id
       LEFT JOIN settlements_paid sp ON u.id = sp.from_user
       LEFT JOIN settlements_received sr ON u.id = sr.to_user
       WHERE u.id IN (
         SELECT friend_id FROM friends WHERE user_id = $1
         UNION
         SELECT user_id FROM friends WHERE friend_id = $1
         UNION
         SELECT $1
       )`,
      [userId]
    );

    return result.rows;
  },
};

export default Expense;
