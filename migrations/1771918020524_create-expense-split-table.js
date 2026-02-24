export const up = (pgm) => {
  pgm.sql(`
        CREATE TABLE expense_splits (
    id SERIAL PRIMARY KEY,
    expense_id INTEGER REFERENCES expenses(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    share_amount DECIMAL(10,2) NOT NULL, -- Is bande ka kitna hissa
    UNIQUE(expense_id, user_id) -- Ek expense mein ek user ek baar
);

CREATE INDEX idx_splits_expense ON expense_splits(expense_id);
CREATE INDEX idx_splits_user ON expense_splits(user_id);
        `);
};

export const down = (pgm) => {
  pgm.sql(`DROP TABLE expense_splits;`);
};
