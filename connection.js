const mysql = require("mysql");
const util = require("util");

const db = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.sqlpw,
    database: "employee"
});

db.connect((err)=>{
    if (err) {
        throw err;
    }
});

db.query = util.promisify(db.query)

module.exports = db;