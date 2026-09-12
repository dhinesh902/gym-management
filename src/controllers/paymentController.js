import db from '../models/index.js';
const {  Payment, Member  } = db;

export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({ include: [Member] });
    res.json({ status: 200, data: payments });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createPayment = async (req, res) => {
  try {
    const payment = await Payment.create(req.body);
    res.status(201).json({ status: 201, data: { message: 'Created successfully' } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
