const express = require("express");
const cors = require("cors");
const bodyParser = require('body-parser')

const app = express();
const sequelize = require("./sequelize");
const port = process.env.PORT || process.env.SERVER_PORT || 3000;
const apiVersion = process.env.API_VERSION || "v1";

sequelize.sync({ alter: true })
  .then(() => console.log("Tables Updated!"))
  .catch(err => console.log(err));

app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

app.use(`/api/${apiVersion}/tenant`, require('./router/tenant'))
app.use(`/api/${apiVersion}/user`, require('./router/users'))
app.use(`/api/${apiVersion}/tenant/user`, require('./router/tenant_user'))
app.use(`/api/${apiVersion}/middleware`, require('./router/verify_token'))

app.listen(port, () => console.log(`Server running on ${port}`));
