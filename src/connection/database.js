const knex = require("knex")({
  client: "pg",
  connection: {
    host: process.env.PGHOST,
    port: process.env.PGPOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
  },
  ssl: { rejectUnauthorized: false },
});

module.exports = knex;
