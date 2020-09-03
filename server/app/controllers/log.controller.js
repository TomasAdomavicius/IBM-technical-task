const db = require("../models");
const Log = db.log;
const Op = db.Sequelize.Op;

exports.create = (req, res) => {
  if (!req.body.Actions || !req.body.Date || !req.body.Parameters) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
    return;
  }

  Log.create(req.body)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the log.",
      });
    });
};

exports.findAll = (req, res) => {
  Log.findAll()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving logs.",
      });
    });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Log.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Log was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete log with id=${id}. Maybe log was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete log with id=" + id,
      });
    });
};

exports.deleteAll = (req, res) => {
  Log.destroy({
    where: {},
    truncate: false,
  })
    .then((nums) => {
      res.send({ message: `${nums} logs were deleted successfully!` });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while removing all logs.",
      });
    });
};
