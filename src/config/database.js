require('dotenv').config();

module.exports = {
  dialect: 'postgres',
  host: (process.env.DB_HOST || 'localhost'),
  username: (process.env.DB_USER || 'postgres'),
  password: (process.env.DB_PASSWORD || 'docker'),
  database: (process.env.DB_NAME || 'testehelpper'),
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};