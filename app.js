const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors({ origin: "*" }));

app.use(function (req, res, next) {
    const err = new Error("Not Found");
    err.status = 404;
    res.status(404).json("Não encontado");
});

const server = app.listen(port, () => {
    console.log(`Listen at ${server.address().address}:${port}`);
});