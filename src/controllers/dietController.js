import db from '../models/index.js';
const {  Diet, Trainer  } = db;

export const getAllDiets = async (req, res) => {
  try {
    const diets = await Diet.findAll({ include: [Trainer] });
    res.json({ status: 200, data: diets });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createDiet = async (req, res) => {
  try {
    const diet = await Diet.create(req.body);
    res.status(201).json({ status: 201, data: { message: 'Created successfully' } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteDiet = async (req, res) => {
  try {
    const diet = await Diet.findByPk(req.params.id);
    if (!diet) return res.status(404).json({ message: 'Diet not found' });
    await diet.destroy();
    res.json({ status: 200, data: { message: 'Diet deleted successfully' } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
