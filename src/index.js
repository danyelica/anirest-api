require("dotenv").config();
const express = require("express");
const app = express();
const routers = require("./routers");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(routers);

const port = process.env.PORT || 3003;
app.listen(port);
