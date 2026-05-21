const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser')

const app = express();
const sequelize = require("./sequelize");

sequelize.sync({ alter: true })
  .then(() => console.log("Tables Updated!"))
  .catch(err => console.log(err));

app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.use(`/api/${process.env.API_VERSION}/tenant`, require('./router/tenant'))
app.use(`/api/${process.env.API_VERSION}/user`, require('./router/users'))
app.use(`/api/${process.env.API_VERSION}/tenant/user`, require('./router/tenant_user'))
app.use(`/api/${process.env.API_VERSION}/middleware`, require('./router/verify_token'))

app.listen(process.env.SERVER_PORT, () => console.log(`Server running on ${process.env.SERVER_PORT}`));
