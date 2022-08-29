const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const Department = require('./department');

class Role extends Model {}

Role.init
(
  {
    id: 
    {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    title: 
    {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    salary:
    {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'role',
  }
);

Role.belongsTo(Department, 
{
    foreignKey: "department_id",
    targetKey: "id",
});

module.exports = Role;
