const schedule = require("node-schedule");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
const app = express();
const parser = require("xml2json");

const getRates = () => {
  return axios
    .get(
      "https://www.lb.lt/webservices/FxRates/FxRates.asmx/getCurrentFxRates",
      {
        params: {
          tp: "eu",
        },
      }
    )
    .then((response) => {
      var options = {
        object: true,
      };
      const FxRate = db.fxRates;
      var json = parser.toJson(response.data, options);
      FxRate.create({ Ccy: "EUR", Amt: 1 });
      json.FxRates.FxRate.forEach((element) => {
        FxRate.create(element.CcyAmt[1]);
      });
    });
};

app.use(cors());

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models");

db.sequelize.sync({ force: true }).then(() => {
  console.log("Drop and re-sync db.");
});

app.get("/", (req, res) => {
  res.json({ message: "Currency conversion application." });
});

require("./app/routes/fxRate.routes")(app);

getRates();

schedule.scheduleJob("0 0 * * *", () => getRates());

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
