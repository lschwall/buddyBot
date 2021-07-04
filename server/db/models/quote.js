module.exports = (sequelize, DataTypes) => {
    const Quote = sequelize.define('quote', {
        quote: {
            type: DataTypes.TEXT,
        },
    }, {
        freezeTableName: true,
    });

    return Quote;
};