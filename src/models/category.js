module.exports = (sequelize, DataTypes) => {
  const category = sequelize.define('category', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: 1,
    },
    parentId: {
      type: DataTypes.INTEGER,

    },
  }, {});
  category.associate = function (models) {
    category.belongsTo(models.category, { as: 'parent', foreignKey: 'id' });
  };
  return category;
};
