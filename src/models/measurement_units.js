module.exports = (sequelize, DataTypes) => {
  const Measurement_units = sequelize.define('Measurement_units', {
    name: DataTypes.STRING,
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
  }, {});
  Measurement_units.associate = function (models) {

  };
  return Measurement_units;
};
