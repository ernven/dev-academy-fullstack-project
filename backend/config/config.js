export const appConfig = {
  port: process.env.PORT
}

export const dbConfig = {
  client: 'pg',
  connection: process.env.PG_CONNECTION_STRING,
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
