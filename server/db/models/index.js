const { Sequelize } = require('sequelize');
require('dotenv').config();

const username = process.env.SQL_USER;
const host = process.env.SQL_HOST;
const database = process.env.SQL_DATABASE;
const password = process.env.SQL_PASS;
const port = process.env.SQL_PORT;

const sequelize = new Sequelize(
    database,
    username,
    password,
    {
        host,
        dialect: 'postgres',
        port,
        logging: false
    }
);

const QuoteModel = require('./quote.js');

const Quote = QuoteModel(sequelize, Sequelize);

const models = {
    Quote,
};

Object.keys(models).forEach((model) => {
    if (models[model].associate) {
        models[model].associate(models);
    }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;
module.exports = models;