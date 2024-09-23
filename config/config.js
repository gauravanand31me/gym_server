// config.js
module.exports = {
    development: {
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DATABAASE_PASSWORD || 'Sourav@1992',
      database: process.env.DB_DATABASE || 'fitzoos',
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || '5432',
      dialect: 'postgres'
    },
    test: {
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || null,
      database: process.env.DB_DATABASE || 'database_test',
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT || '3306',
      dialect: 'mysql'
    },
    production: {
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: 'postgres'
    }
  };
  