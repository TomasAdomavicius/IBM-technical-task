module.exports = (sequelize, Sequelize) => {
    const FxRate = sequelize.define("fxRate", {
    Ccy: {
        type: Sequelize.STRING
    },
    Amt: {
        type: Sequelize.DOUBLE
    }
    });
    return FxRate;
  };