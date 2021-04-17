module.exports = (sequelize, DataTypes) => {
  const Sales_return_detail = sequelize.define('Sales_return_detail', {
    return_qty: DataTypes.INTEGER,
    item_id: DataTypes.INTEGER,
    sr_number: DataTypes.INTEGER,
  }, {});
  Sales_return_detail.associate = function (models) {
    Sales_return_detail.belongsTo(models.item, {
      foreignKey: 'item_id',
    });
    Sales_return_detail.belongsTo(models.Sales_return_master, {
      foreignKey: 'sr_number',
    });
  };
  return Sales_return_detail;
};
