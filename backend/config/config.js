export const appConfig = {
  port: process.env.PORT
}

export const dbConfig = {
  client: 'pg',
  // We can pass an URL String instead of all parameters separately.
  connection: process.env.DATABASE_URL,
  /*
  connection: {
    host: process.env.DB_URI,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  */
}
