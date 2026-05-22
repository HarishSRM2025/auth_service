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

const connectionUrl = process.env.DATABASE_URL || process.env.DB_URL;

const commonOptions = {
    dialect: "postgres",
    logging: false,
};

const renderSslOptions = {
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false,
        },
    },
};

const shouldUseSsl = process.env.DB_SSL === "true" || Boolean(connectionUrl);

const sequelize = connectionUrl
    ? new Sequelize(connectionUrl, {
        ...commonOptions,
        ...(shouldUseSsl ? renderSslOptions : {}),
    })
    : new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASS,
        {
            ...commonOptions,
            host: process.env.DB_HOST,
            port: process.env.DB_PORT || 5432,
            ...(shouldUseSsl ? renderSslOptions : {}),
        }
    );

sequelize.authenticate()
    .then(() => console.log("PostgreSQL Connected"))
    .catch(err => console.log("DB Error:", err));

module.exports = sequelize;
