const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
  const Purchase_return_master = sequelize.define('Purchase_return_master', {
    grn_number: {
      type: DataTypes.INTEGER,
    },
    createdDate: {
      type: DataTypes.VIRTUAL,
      get() {
        const name = moment(this.getDataValue('createdAt')).format('YYYY-MM-DD');
        return name;
      },
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  }, {});
  Purchase_return_master.associate = function (models) {
    Purchase_return_master.belongsTo(models.Grn_master, {
      foreignKey: 'grn_number',
    });
  };
  return Purchase_return_master;
};
