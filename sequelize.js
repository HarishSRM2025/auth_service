// const { Sequelize } = require("sequelize");

// const sequelize = new Sequelize("erp_db", "root", "2526", {
//     host: "localhost",
//     dialect: "mysql"
// });

// sequelize.authenticate()
//     .then(() => console.log("MySQL Connected"))
//     .catch(err => console.log("DB Error:", err));

// module.exports = sequelize;



// require("dotenv").config();
// const { Sequelize } = require("sequelize");

// const connectionUrl = process.env.DB_URL;

// const commonOptions = {
//     dialect: "postgres",
//     logging: false,
// };

// const renderSslOptions = {
//     dialectOptions: {
//         ssl: {
//             require: true,
//             rejectUnauthorized: false,
//         },
//     },
// };

// const shouldUseSsl = process.env.DB_SSL === "true" || Boolean(connectionUrl);

// const sequelize = connectionUrl
//     ? new Sequelize(connectionUrl, {
//         ...commonOptions,
//         ...(shouldUseSsl ? renderSslOptions : {}),
//     })
//     : new Sequelize(
//         process.env.DB_NAME,
//         process.env.DB_USER,
//         process.env.DB_PASS,
//         {
//             ...commonOptions,
//             host: process.env.DB_HOST,
//             port: process.env.DB_PORT || 5432,
//             ...(shouldUseSsl ? renderSslOptions : {}),
//         }
//     );

// if (!process.env.VERCEL) {
//     sequelize.authenticate()
//         .then(() => console.log("PostgreSQL Connected"))
//         .catch(err => console.log("DB Error:", err));
// }

// module.exports = sequelize;


require("dotenv").config();
const { Sequelize } = require("sequelize");

let sequelize;

if (process.env.DB_URL) {
  // Connect using Neon connection string
  sequelize = new Sequelize(process.env.DB_URL, {
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
} else {
  // Connect using individual environment variables
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT || 5432,
      dialect: "postgres",
      logging: false,
      dialectOptions: {
        ssl: process.env.DB_SSL === "true"
          ? {
              require: true,
              rejectUnauthorized: false,
            }
          : false,
      },
    }
  );
}

// Test Database Connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ PostgreSQL Connected Successfully");
  } catch (error) {
    console.error("❌ Database Connection Failed:");
    console.error(error);
  }
})();

module.exports = sequelize;