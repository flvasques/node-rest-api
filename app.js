const express = require("express");
const cors = require("cors");
const sequelize = require('./dbService');
const dbsync = require('./db-sync');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }));

const index = require('./routes/index');
app.use('/api', index);

app.use(function (req, res, next) {
    const err = new Error("Not Found");
    err.status = 404;
    return res.status(404).json("Não encontrado");
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');

        await dbsync();

    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();

const server = app.listen(port, () => {
    console.log(`Listen at ${server.address().address}:${port}`);
});