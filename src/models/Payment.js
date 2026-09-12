import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  memberId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  paymentDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  paymentMethod: {
    type: DataTypes.ENUM('cash', 'card', 'online', 'bank_transfer'),
    defaultValue: 'cash',
  },
  status: {
    type: DataTypes.ENUM('completed', 'pending', 'failed'),
    defaultValue: 'completed',
  },
}, {
  timestamps: true,
});

export default Payment;
