module.exports = (sequelize, DataTypes) => {
  const customer = sequelize.define('customer', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    type: {
      type: DataTypes.ENUM,
      values: ['customer', 'supplier'],
      allowNull: false,
      unique: 'compositeIndex',

    },
    title: {
      type: DataTypes.ENUM,
      values: ['Mr', 'Ms'],
      allowNull: false,
      unique: 'compositeIndex',

    },
    customer_type: {
      type: DataTypes.STRING,
      // values: ['especial', 'general'],
      allowNull: false,
    },
    first_name: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: 'compositeIndex',
    },
    last_name: {
      type: DataTypes.STRING,
      unique: 'compositeIndex',
    },
    email: {
      type: DataTypes.STRING,
    },
    contact_number: {
      type: DataTypes.STRING,
    },
    nic: {
      type: DataTypes.STRING,
    },
    skype_ID: {
      type: DataTypes.STRING,
    },
    dob: {
      type: DataTypes.DATEONLY,
    },
    notes: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: 1,
    },
    fullName: {
      type: DataTypes.VIRTUAL,
      get() {
        const name = `${this.getDataValue('title')} ${this.getDataValue('first_name')} ${this.getDataValue('last_name')}`;
        return name;
      },
    },
    address: { type: DataTypes.STRING(300) },
  }, {});
  customer.associate = function (models) {
    // customer.hasOne(models.address, {
    //   foreignKey: 'customer_id',
    // });
  };
  return customer;
};
