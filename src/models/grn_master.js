const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
  const Grn_master = sequelize.define('Grn_master', {
    supplier_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'customer',
        key: 'id',
      },
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 1,
    },
    purchaseReturned: {
      type: DataTypes.VIRTUAL,
      get() {
        const name = `${this.getDataValue('status') === true ? 'No' : 'Returned'}`;
        return name;
      },
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
  Grn_master.associate = function (models) {
    Grn_master.belongsTo(models.customer, {
      foreignKey: 'supplier_id',
    });
  };
  return Grn_master;
};
