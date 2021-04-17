const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      role: {
        type: DataTypes.ENUM,
        values: ['admin', 'manager', 'staff'],
        allowNull: false,
      },
      title: {
        type: DataTypes.BOOLEAN,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
      },
      // surname: {
      //   type: DataTypes.STRING,
      // },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      // employee_number: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      //   unique: true,
      // },
      contact_number: {
        type: DataTypes.STRING,
      },
      notes: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      emergency_contact_person: {
        type: DataTypes.STRING,
      },
      emergency_contact_number: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: 1,
      },
      fullName: {
        type: DataTypes.VIRTUAL,
        get() {
          const name = `${
            this.getDataValue('title') === true ? 'Mr. ' : 'Ms. '
          } ${this.getDataValue('first_name')} ${this.getDataValue(
            'last_name',
          )}`;
          return name;
        },
      },
      permissions: {
        type: DataTypes.TEXT,
      },
    },
    {
      hooks: {
        beforeCreate(user) {
          const salt = bcrypt.genSaltSync(10);
          user.password = bcrypt.hashSync(user.password, salt);
        },
      },
    },
  );
  User.associate = function (models) {
    // associations can be defined here
  };
  return User;
};
