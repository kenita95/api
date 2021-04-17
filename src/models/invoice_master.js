const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
  const Invoice_master = sequelize.define('Invoice_master', {
    status: {
      type: DataTypes.INTEGER,
    },
    customer_id: {
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
    billNo: { type: DataTypes.STRING },
    referenceNo: { type: DataTypes.STRING },
    deliveryCost: { type: DataTypes.FLOAT },
  }, {});
  Invoice_master.associate = function (models) {
    Invoice_master.belongsTo(models.customer, {
      foreignKey: 'customer_id',
    });
    Invoice_master.hasMany(models.Invoice_detail, {
      foreignKey: 'invoice_id',
    });
  };
  return Invoice_master;
};
