module.exports = (sequelize, DataTypes) => {
  const Purchase_return_detail = sequelize.define('Purchase_return_detail', {
    qty: {
      type: DataTypes.FLOAT,
    },
    return_qty: {
      type: DataTypes.FLOAT,
    },
    item_id: {
      type: DataTypes.INTEGER,
    },
    pr_number: {
      type: DataTypes.INTEGER,
    },
  }, {});
  Purchase_return_detail.associate = function (models) {
    Purchase_return_detail.belongsTo(models.item, {
      foreignKey: 'item_id',
    });
    // Purchase_return_detail.belongsTo(models.purchase_return_master, {
    //   foreignKey: 'id'
    // })
  };
  return Purchase_return_detail;
};
