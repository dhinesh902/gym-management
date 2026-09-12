import db from '../models/index.js';
const {  Attendance, Member  } = db;

export const getAllAttendance = async (req, res) => {
  try {
    const records = await Attendance.findAll({ include: [Member] });
    res.json({ status: 200, data: records });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const markAttendance = async (req, res) => {
  try {
    const { memberId, date, checkInTime, checkOutTime } = req.body;
    let record = await Attendance.findOne({ where: { memberId, date } });

    if (record) {
      if (checkOutTime) {
        await record.update({ checkOutTime });
        return res.json({ status: 200, data: { message: 'Updated successfully' } });
      }
      return res.status(400).json({ message: 'Attendance already marked for this date' });
    }

    record = await Attendance.create({ memberId, date, checkInTime, checkOutTime });
    res.status(201).json({ status: 201, data: { message: 'Created successfully' } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
