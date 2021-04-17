module.exports = (sequelize, DataTypes) => {
  const subcategory = sequelize.define('subcategory', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: 1,
    },
    category_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'category',
        key: 'id',
      },
    },

  }, {});
  subcategory.associate = function (models) {
    subcategory.belongsTo(models.category, {
      foreignKey: 'category_id',
    });
  };
  return subcategory;
};
