export const up = (pgm) => {
  pgm.sql(`
        CREATE TABLE settlements (
    id SERIAL PRIMARY KEY,
    from_user INTEGER REFERENCES users(id) ON DELETE CASCADE,
    to_user INTEGER REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    date DATE NOT NULL,
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_settlements_from ON settlements(from_user);
CREATE INDEX idx_settlements_to ON settlements(to_user);`);
};

export const down = (pgm) => {
  pgm.sql(`DROP TABLE settlements;`);
};
