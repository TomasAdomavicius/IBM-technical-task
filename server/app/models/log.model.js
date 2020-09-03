module.exports = (sequelize, Sequelize) => {
    const Log = sequelize.define("log", {
      Action: {
        type: Sequelize.STRING
      },
      Date: {
        type: Sequelize.DATE 
      },
      Parameters: {
        type: Sequelize.STRING
      }
    });
    return Log;
  };