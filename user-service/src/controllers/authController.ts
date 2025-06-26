import { Request, Response } from 'express';
import { StudentModel } from '../models/student';
import { TeacherModel } from '../models/teacher';
import { authService } from '../services/authService';
import { publishUserRegistered } from '../rabbit/publisher';

const register = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, username, password, role } = req.body;

    if (!firstName || !lastName || !username || !password || !role) {
      res.status(400).json({ error: 'All fields are required' });
      return;
    }

    if (role !== 'student' && role !== 'teacher') {
      res.status(400).json({ error: 'Invalid role' });
      return;
    }

    const user = await authService.registerUser(
      firstName,
      lastName,
      username,
      password,
      role,
    );

    await publishUserRegistered({
      userId: user._id.toString(),
      firstName,
      lastName,
      username,
      role,
      registeredAt: new Date().toISOString(),
    });

    const token = authService.generateToken(user._id.toString(), role);
    res.status(201).json({ token });
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ error: error.message });
  }
};

const login = async (req: Request, res: Response) => {
  const { username, password, role } = req.body;

  let user;

  if (role === 'student') {
    user = await StudentModel.findOne({ username });
  } else if (role === 'teacher') {
    user = await TeacherModel.findOne({ username });
  } else {
    res.status(400).json({ error: 'Invalid role' });
    return;
  }

  if (!user || !(await user.comparePassword(password))) {
    res.status(400).json({ error: 'Invalid credentials' });
    return;
  }

  const token = authService.generateToken(user._id.toString(), role);
  res.status(200).json({ token });
};

const getProfile = async (req: Request, res: Response) => {
  try {
    const { userId, role } = req;

    if (!userId || !role) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const model = role === 'student' ? StudentModel : TeacherModel;
    const user = await model.findById(userId).select('-password').lean();

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json({ ...user, role });
  } catch (err) {
    console.error('Error in getProfile:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const { userId, role } = req;

    if (!userId || !role) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const model = role === 'student' ? StudentModel : TeacherModel;
    const result = await model.findByIdAndDelete(userId);

    if (!result) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.status(204).send();
  } catch (err) {
    console.error('Error in deleteUser:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const authController = {
  register,
  login,
  getProfile,
  deleteUser,
};
