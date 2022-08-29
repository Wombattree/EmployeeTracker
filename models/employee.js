const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const Role = require('./role');

class Employee extends Model {}

Employee.init
(
  {
    id: 
    {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    first_name: 
    {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    last_name: 
    {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'employee',
  }
);

Employee.belongsTo(Role,
{
    foreignKey: "role_id",
    targetKey: "id",
});

Employee.belongsTo(Employee,
{
    foreignKey: "manager_id",
    targetKey: "id",
});

module.exports = Employee;
