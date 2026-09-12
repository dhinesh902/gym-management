import db from '../models/index.js';
const {  Member, Trainer, Payment, Attendance  } = db;

export const getStats = async (req, res) => {
  try {
    const totalMembers = await Member.count();
    const totalTrainers = await Trainer.count();
    
    // Total revenue calculation
    const payments = await Payment.findAll({ where: { status: 'completed' } });
    const totalRevenue = payments.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
    
    // Today's attendance
    const today = new Date().toISOString().split('T')[0];
    const todaysAttendance = await Attendance.count({ where: { date: today } });

    res.json({
      status: 200,
      data: {
        totalMembers,
        totalTrainers,
        totalRevenue,
        todaysAttendance
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
