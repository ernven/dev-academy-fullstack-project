module.exports = {
  app: {
      port: process.env.PORT
  },
  db: {
      client: 'mysql2',
      connection: {
          host: process.env.DB_URI,
          port: process.env.DB_PORT,
          database: process.env.DB_SCHEMA,
          user: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
      },
  },
}
