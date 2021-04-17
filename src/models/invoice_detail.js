module.exports = (sequelize, DataTypes) => {
  const Invoice_detail = sequelize.define(
    'Invoice_detail',
    {
      unit_price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      qty: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      invoice_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Invoice_masters',
          key: 'id',
        },
      },
      item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'items',
          key: 'id',
        },
      },
      serialNumber: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Stocks',
          key: 'id',
        },
      },
    },
    {},
  );
  Invoice_detail.associate = function (models) {
    Invoice_detail.belongsTo(models.item, {
      foreignKey: 'item_id',
    });
    Invoice_detail.belongsTo(models.Invoice_master, {
      foreignKey: 'invoice_id',
    });
  };
  return Invoice_detail;
};
