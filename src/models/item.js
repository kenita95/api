module.exports = (sequelize, DataTypes) => {
  const item = sequelize.define(
    'item',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      measurement_unit: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      selling_price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      categoryId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'category',
          key: 'id',
        },
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: 1,
      },
      reorder_level: {
        type: DataTypes.INTEGER,
      },
      description: {
        type: DataTypes.STRING,
      },
      bulkQR: {
        type: DataTypes.BOOLEAN,
      },
      images: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
      make: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
      model: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
      serialNumber: {
        type: DataTypes.STRING,
        defaultValue: '',
      },
    },
    {},
  );
  item.associate = function (models) {
    item.belongsTo(models.category, {
      foreignKey: 'categoryId',
    });
    item.hasOne(models.Stock, {
      foreignKey: 'item_id',
    });
    item.belongsTo(models.Measurement_units, {
      foreignKey: 'measurement_unit',
    });
  };
  return item;
};
