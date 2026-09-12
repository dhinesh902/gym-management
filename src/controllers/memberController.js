import db from '../models/index.js';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const { Member, Trainer, MemberSubscription, MembershipPlan } = db;

export const getAllMembers = async (req, res) => {
  try {
    const members = await Member.findAll({
      attributes: { exclude: ['password'] },
      include: [
        Trainer,
        { model: MemberSubscription, include: [MembershipPlan] }
      ]
    });
    res.json({ status: 200, data: members });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getMemberById = async (req, res) => {
  try {
    const member = await Member.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
      include: [
        Trainer,
        { model: MemberSubscription, include: [MembershipPlan] }
      ]
    });
    if (!member) return res.status(404).json({ message: 'Member not found' });
    res.json({ status: 200, data: member });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const createMember = async (req, res) => {
  try {
    let memberData = { ...req.body };
    if (memberData.password) {
      const salt = await bcrypt.genSalt(10);
      memberData.password = await bcrypt.hash(memberData.password, salt);
    }
    const member = await Member.create(memberData);
    res.status(201).json({ status: 201, data: { message: 'Created successfully' } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateMember = async (req, res) => {
  try {
    const member = await Member.findByPk(req.params.id);
    if (!member) return res.status(404).json({ message: 'Member not found' });

    if (req.body.profilephoto && member.profilephoto) {
      const oldPhotoPath = path.join(process.cwd(), 'public', member.profilephoto);
      if (fs.existsSync(oldPhotoPath)) {
        fs.unlinkSync(oldPhotoPath);
      }
    }

    let updateData = { ...req.body };
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(updateData.password, salt);
    }

    await member.update(updateData);
    res.json({ status: 200, data: { message: 'Updated successfully' } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteMember = async (req, res) => {
  try {
    const member = await Member.findByPk(req.params.id);
    if (!member) return res.status(404).json({ message: 'Member not found' });

    // Delete the profile photo file if it exists
    if (member.profilephoto) {
      const photoPath = path.join(process.cwd(), 'public', member.profilephoto);
      if (fs.existsSync(photoPath)) {
        fs.unlinkSync(photoPath);
      }
    }

    await member.destroy();
    res.json({ status: 200, data: { message: 'Member deleted successfully' } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const loginMember = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing required fields' });
    
    const member = await Member.findOne({ where: { email } });
    if (!member) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, member.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const payload = { id: member.id, role: 'member' };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'super_secret_jwt_key_12345', { expiresIn: '1d' });

    res.json({ status: 200, data: { token, user: { id: member.id, role: 'member', message: "Logged in successfully" } } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
