const express = require("express"); //*imports server package
const router = require("./routes");
const morgan = require("morgan");
const cors = require("cors");


const server = express(); //*creates server



server.use(morgan("dev"));
server.use(express.json());
server.use(cors());

server.use(router);



//* lists all existing countries
server.get("/", async (req, res) => {
    const search = req.query;
    try {
        res.status(200).json("holi");
    } catch (error) {
        res.status(400).json({ error: error.message});
    }
});






module.exports = server; //*exports server