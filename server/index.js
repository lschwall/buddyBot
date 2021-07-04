const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const port = process.env.PORT || 3000;

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

app.listen(port, () => {
    console.log(`App listening on port :${port}`);
})