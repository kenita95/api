module.exports = (sequelize, DataTypes) => {
  const Grn_detail = sequelize.define('Grn_detail', {
    unit_price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    qty: {
      type: DataTypes.FLOAT,
      allowNull: false,

    },
    grn_master_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Grn_master',
        key: 'id',
      },
    },
    item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'item',
        key: 'id',
      },
    },

  }, {});
  Grn_detail.associate = function (models) {
    Grn_detail.belongsTo(models.Grn_master, {
      foreignKey: 'grn_master_id',
    });
    Grn_detail.belongsTo(models.item, {
      foreignKey: 'item_id',
    });
  };
  return Grn_detail;
};
