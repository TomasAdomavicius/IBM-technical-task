module.exports = (app) => {
  const fxRates = require("../controllers/fxRate.controller.js");

  var router = require("express").Router();

  router.post("/", fxRates.create);

  router.get("/", fxRates.findAll);

  router.put("/:id", fxRates.update);

  router.delete("/:id", fxRates.delete);

  router.delete("/", fxRates.deleteAll);

  router.get("/currencies", fxRates.findAllCurrencies);

  router.get("/getConvertedValue", fxRates.getConvertedValue);

  app.use("/api/fxRates", router);
};
