export const appConfig = {
  port: process.env.PORT
}

// Setting DB configuration. We can pass an URL String instead of all parameters separately.
export const dbConfig = process.env.NODE_ENV === 'production' ?
  // I have used HEROKU for production, and the settings need to be set as:
  {
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL + '?sslmode=require,',
      ssl: { rejectUnauthorized: false },
    }
  }
  // Used during dev with Azure Postgres DB
  : {
    client: 'pg',
    connection: process.env.DATABASE_URL,
  }
  
  /* Separately, it would be like this.
  connection: {
    host: process.env.DB_URI,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  */
