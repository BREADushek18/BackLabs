import jwt from 'jsonwebtoken';
import { StudentModel } from '../models/student';
import { TeacherModel } from '../models/teacher';
import { IStudent, ITeacher } from '../types/types';

const registerUser = async (
  firstName: string,
  lastName: string,
  username: string,
  password: string,
  role: 'student' | 'teacher',
) => {
  let existingUser;
  if (role === 'student') {
    existingUser = await StudentModel.findOne({ username });
  } else {
    existingUser = await TeacherModel.findOne({ username });
  }
  if (existingUser) {
    throw new Error('User already exists');
  }

  let user;
  if (role === 'student') {
    user = new StudentModel({ firstName, lastName, username, password });
  } else {
    user = new TeacherModel({ firstName, lastName, username, password });
  }
  await user.save();
  return user;
};

const loginUser = async (
  username: string,
  password: string,
  role: 'student' | 'teacher',
) => {
  let user: IStudent | ITeacher | null;
  if (role === 'student') {
    user = (await StudentModel.findOne({ username })) as IStudent;
  } else {
    user = (await TeacherModel.findOne({ username })) as ITeacher;
  }
  if (!user || !(await user.comparePassword(password))) {
    throw new Error('Invalid credentials');
  }
  return user;
};

const generateToken = (userId: string, role: 'student' | 'teacher') => {
  return jwt.sign({ userId, role }, process.env.JWT_SECRET!, {
    expiresIn: '1h',
  });
};

const getUserById = async (userId: string) => {
  const student = await StudentModel.findById(userId);
  if (student) {
    return { ...student.toObject(), role: 'student' };
  }

  const teacher = await TeacherModel.findById(userId);
  if (teacher) {
    return { ...teacher.toObject(), role: 'teacher' };
  }

  return null;
};

const deleteUser = async (userId: string) => {
  await StudentModel.findByIdAndDelete(userId);
  await TeacherModel.findByIdAndDelete(userId);
};

export const authService = {
  registerUser,
  loginUser,
  generateToken,
  getUserById,
  deleteUser,
};
