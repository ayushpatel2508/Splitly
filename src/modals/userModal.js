import pool from "../config/db";

const User = {
  async create(username, email, password) {
    const result = await pool.query(
      `
            INSERT INTO users (username, email, password) 
            VALUES ($1, $2, $3)
            RETURNING id, username, email, created_at
        `,
      [username, email, password]
    );

    return result.rows[0];
  },

  async find(email) {
    const result = await pool.query(
      `
            SELECT id, username, email FROM users WHERE email = $1 
        `,
      [email]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query(
      `DELETE FROM users WHERE id = $1 RETURNING username, email`,
      [id]
    );

    return result.rows[0];
  },

  async update(id, updates) {
    const { username, email } = updates;
    const result = await pool.query(
      `UPDATE users 
       SET username = COALESCE($1, username), 
           email = COALESCE($2, email)
       WHERE id = $3
       RETURNING id, username, email, created_at`,
      [username, email, id]
    );
    return result.rows[0];
  },
};

export default User;
