const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "root",
  database: "leavemanagementsystem",
});

module.exports = router;
