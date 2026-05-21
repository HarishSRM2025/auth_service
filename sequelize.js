// const { Sequelize } = require("sequelize");

// const sequelize = new Sequelize("rydmate", "root", "2526", {
//     host: "localhost",
//     dialect: "mysql"
// });

// sequelize.authenticate()
//     .then(() => console.log("MySQL Connected"))
//     .catch(err => console.log("DB Error:", err));

// module.exports = sequelize;



require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "postgres"
    }
);

sequelize.authenticate()
    .then(() => console.log("PostgreSQL Connected"))
    .catch(err => console.log("DB Error:", err));

module.exports = sequelize;
