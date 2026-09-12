import db from '../models/index.js';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const { Trainer, Member, Workout, Diet } = db;

export const getAllTrainers = async (req, res) => {
  try {
    const trainers = await Trainer.findAll({
      attributes: { exclude: ['password'] }
    });
    res.json({ status: 200, data: trainers });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getTrainerById = async (req, res) => {
  try {
    const trainer = await Trainer.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: [Member, Workout, Diet]
    });
    if (!trainer) return res.status(404).json({ message: 'Trainer not found' });
    res.json({ status: 200, data: trainer });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createTrainer = async (req, res) => {
  try {
    let trainerData = { ...req.body };
    if (trainerData.password) {
      const salt = await bcrypt.genSalt(10);
      trainerData.password = await bcrypt.hash(trainerData.password, salt);
    }
    const trainer = await Trainer.create(trainerData);
    res.status(201).json({ status: 201, data: { message: 'Created successfully' } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findByPk(req.params.id);
    if (!trainer) return res.status(404).json({ message: 'Trainer not found' });

    // If a new profile photo is uploaded and an old one exists, delete the old one
    if (req.body.profilephoto && trainer.profilephoto) {
      const oldPhotoPath = path.join(process.cwd(), 'public', trainer.profilephoto);
      if (fs.existsSync(oldPhotoPath)) {
        fs.unlinkSync(oldPhotoPath);
      }
    }

    let updateData = { ...req.body };
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    await trainer.update(updateData);
    res.json({ status: 200, data: { message: 'Updated successfully' } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteTrainer = async (req, res) => {
  try {
    const trainer = await Trainer.findByPk(req.params.id);
    if (!trainer) return res.status(404).json({ message: 'Trainer not found' });

    // Delete the profile photo file if it exists
    if (trainer.profilephoto) {
      const photoPath = path.join(process.cwd(), 'public', trainer.profilephoto);
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }

    await trainer.destroy();
    res.json({ status: 200, data: { message: 'Trainer deleted successfully' } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const loginTrainer = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing required fields' });
    
    const trainer = await Trainer.findOne({ where: { email } });
    if (!trainer) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, trainer.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const payload = { id: trainer.id, role: 'trainer' };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'super_secret_jwt_key_12345', { expiresIn: '1d' });

    res.json({ status: 200, data: { token, user: { id: trainer.id, role: 'trainer', message: "Logged in successfully" } } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
