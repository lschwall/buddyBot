const express = require('express');
const path = require('path');
const { bot } = require('../bot/main')

const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const models = require('./db/models/index')

//routes
const { quoteRouter } = require('./db/routes/Quote')
app.use('/quote', quoteRouter)

//database

/* Connection */

const connection = async () => {
    try {
        await models.sequelize.authenticate();
        console.info('Database Connection Successful');
    } catch (error) {
        console.warn('Database Connection Cannot Be Established', error);
    }
};

const syncModels = async () => {
    try {
        await models.sequelize.sync();
        console.info('Model Sync Successful');
    } catch (error) {
        console.warn('Failed to Sync Models:', error);
    }
};

connection();
syncModels();
bot();

app.listen(port, () => {
    console.log(`App listening on port :${port}`);
})