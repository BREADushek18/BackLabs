import { model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import { ITeacher } from '../types/types';

const teacherSchema = new Schema<ITeacher>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

teacherSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err: any) {
    return next(err);
  }
});

teacherSchema.methods.comparePassword = async function (
  candidatePassword: string,
) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export const TeacherModel = model<ITeacher>('Teacher', teacherSchema);
