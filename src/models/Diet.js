import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Diet = sequelize.define('Diet', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  dietgoal: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  calories: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  diettype: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  morning: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  lunch: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  dinner: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  restrictions: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  timestamps: true,
});

export default Diet;
