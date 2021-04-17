module.exports = (sequelize, DataTypes) => {
  const Stock = sequelize.define('Stock', {
    qty: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    // status: {
    //   type: DataTypes.BOOLEAN,
    //   allowNull: false,
    //   defaultValue: 1

    // },
    item_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'item',
        key: 'id',
      },
    },
    grnId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Grn_masters',
        key: 'id',
      },

    },
    invoiceId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Invoice_masters',
        key: 'id',
      },

    },
    srId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Sales_return_masters',
        key: 'id',
      },

    },
    PrId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Purchase_return_masters',
        key: 'id',
      },

    },
  }, {
    // hooks: {
    //   beforeUpdate: function (Stock, options) {
    //     console.log("Stock", Stock._previousDataValues.qty);
    //   },
    // }
  });
  Stock.associate = function (models) {
    Stock.belongsTo(models.item, {
      foreignKey: 'item_id',
    });
  };
  return Stock;
};
