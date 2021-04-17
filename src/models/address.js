module.exports = (sequelize, DataTypes) => {
  const address = sequelize.define('address', {
    customer_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'customer',
        key: 'id',
      },
    },
    address_line_one: {
      type: DataTypes.STRING,
    },
    address_line_two: {
      type: DataTypes.STRING,
    },
    address_line_three: {
      type: DataTypes.STRING,
    },
    address_line_four: {
      type: DataTypes.STRING,
    },

  }, {});
  address.associate = function (models) {
    address.belongsTo(models.customer, {
      foreignKey: 'customer_id',
    });
  };
  return address;
};
