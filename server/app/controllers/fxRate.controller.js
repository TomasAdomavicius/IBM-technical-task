const db = require("../models");
var FxRate = require("../models/index").fxRates;
var Log = require("../models/index").logs;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  Log.create({
    Action: `create fxRate`,
    Date: Date.now(),
    Parameters: JSON.stringify(req.query),
  });

  if (!req.body.Ccy || !req.body.Amt) {
    res.status(400).send({
      message: "Currency name or rate can not be empty!",
    });
    return;
  }

  FxRate.create(req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the FxRate.",
      });
    });
};

exports.findAll = (req, res) => {
  Log.create({
    Action: "find all fxRates",
    Date: Date.now(),
    Parameters: JSON.stringify(req.query),
  });

  FxRate.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving FxRates.",
      });
    });
};

exports.update = (req, res) => {
  const id = req.params.id;

  Log.create({
    Action: `update fxRate with id=${id}`,
    Date: Date.now(),
    Parameters: JSON.stringify(req.query),
  });

  FxRate.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "FxRate was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update FxRate with id=${id}. Maybe FxRate was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating FxRate with id=" + id,
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Log.create({
    Action: `delete fxRate with id=${id}`,
    Date: Date.now(),
    Parameters: JSON.stringify(req.query),
  });

  FxRate.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "FxRate was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete FxRate with id=${id}. Maybe FxRate was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete FxRate with id=" + id,
      });
    });
};

exports.deleteAll = (req, res) => {
  Log.create({
    Action: "delete all fxRates",
    Date: Date.now(),
    Parameters: JSON.stringify(req.query),
  });
  FxRate.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} FxRates were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all FxRates.",
      });
    });
};

exports.findAllCurrencies = (req, res) => {
  Log.create({
    Action: "find all currencies",
    Date: Date.now(),
    Parameters: JSON.stringify(req.query),
  });
  FxRate.findAll()
    .then((data) => {
      res.send(data.map((d) => d.Ccy));
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving currency list.",
      });
    });
};

exports.getConvertedValue = (req, res) => {
  Log.create({
    Action: "get converted value",
    Date: Date.now(),
    Parameters: JSON.stringify(req.query),
  });
  FxRate.findAll()
    .then((fxRates) => {
      let fromRate = fxRates.find(
        (fxRate) => fxRate.Ccy === req.query.fromCurrency
      ).Amt;
      let toRate = fxRates.find((fxRate) => fxRate.Ccy === req.query.toCurrency)
        .Amt;
      let result = (req.query.amount / fromRate) * toRate;
      res.send({ result });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while converting value.",
      });
    });
};
