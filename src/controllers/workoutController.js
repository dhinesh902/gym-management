import db from '../models/index.js';
const {  Workout, Trainer  } = db;

export const getAllWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.findAll({ include: [Trainer] });
    res.json({ status: 200, data: workouts });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createWorkout = async (req, res) => {
  try {
    const workout = await Workout.create(req.body);
    res.status(201).json({ status: 201, data: { message: 'Created successfully' } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findByPk(req.params.id);
    if (!workout) return res.status(404).json({ message: 'Workout not found' });
    await workout.destroy();
    res.json({ status: 200, data: { message: 'Workout deleted successfully' } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
