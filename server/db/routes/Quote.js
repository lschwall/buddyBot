const { Quote } = require('../models/index')
const { Router } = require('express');
const quoteRouter = Router();
const sequelize = require('sequelize');

quoteRouter.get('/', (req, res) => {
    Quote.findAll()
        .then(list => list.length > 0 ? res.send(list) : res.send(null))
        .catch(err => console.error(err))
})
quoteRouter.post('/create', async (req, res) => {
    const { quote } = req.query;
    Quote.create({
        quote: decodeURI(quote)
    })
        .catch(err => console.error(err))
})
quoteRouter.get('/find', (req, res) => {
    Quote.findAll({ order: sequelize.literal('random()'), limit: 1 })
        .then((quote) => {
            res.send(quote[0].quote)
        })
        .catch(err => console.error(err))
})
quoteRouter.put('/', (req, res) => {
    res.send('SUCCESS PUT')
})
quoteRouter.delete('/', (req, res) => {
    res.send('SUCCESS DELETE')
})

module.exports = {
    quoteRouter
}