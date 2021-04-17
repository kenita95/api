module.exports = (sequelize, DataTypes) => {
  const Audit = sequelize.define('Audit', {
    action: {
      type: DataTypes.STRING,
    },
    area: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    },
    reference: {
      type: DataTypes.STRING,

    },
  }, {});
  Audit.associate = function (models) {
    // associations can be defined here
  };
  return Audit;
};
