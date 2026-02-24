export const up = (pgm) => {
  pgm.sql(`
        CREATE TABLE friends(
        id serial PRIMARY KEY,
        user_one INTEGER REFERENCES  users(id) ON DELETE CASCADE,
        user_two INTEGER REFERENCES  users(id) ON DELETE CASCADE,
        UNIQUE(user_one,user_two)
        );
        `);
};

export const down = (pgm) => {
  pgm.sql(`DROP TABLE friends;`);
};
