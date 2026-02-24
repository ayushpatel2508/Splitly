export const up = (pgm) => {
  pgm.sql(`
     CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    description TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    paid_by INTEGER REFERENCES users(id) ON DELETE CASCADE,
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE, -- Use this for everything
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- For fast monthly/yearly queries, use an Expression Index
CREATE INDEX idx_expenses_date_month_year ON expenses (EXTRACT(MONTH FROM expense_date), EXTRACT(YEAR FROM expense_date));
CREATE INDEX idx_expenses_paid_by ON expenses(paid_by);
        `);
};

export const down = (pgm) => {
  pgm.sql(`DROP TABLE expenses CASCADE;`);
};
