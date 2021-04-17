module.exports = (sequelize, DataTypes) => {
  const Sales_return_master = sequelize.define('Sales_return_master', {
    invoice_number: DataTypes.INTEGER,
  }, {});
  Sales_return_master.associate = function (models) {
    Sales_return_master.belongsTo(models.Invoice_master, {
      foreignKey: 'invoice_number',
    });
  };
  return Sales_return_master;
};
