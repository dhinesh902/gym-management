import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Workout = sequelize.define('Workout', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  targetMuscle: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  trainerId: {
    type: DataTypes.INTEGER,
    allowNull: true, // If null, it's a general workout
  },
}, {
  timestamps: true,
});

export default Workout;
