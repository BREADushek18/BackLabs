import { Types } from 'mongoose';

export interface IStudent {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface ITeacher {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface ICourse {
  title: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  published: boolean;
  author: Types.ObjectId;
  createdAt: Date;
  tags: Types.ObjectId[];
  favoritesCount?: number;
}

export interface ICourseFavourite extends Document {
  userId: Types.ObjectId;
  courseId: Types.ObjectId;
}

export interface ITag {
  _id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: Date;
}

export interface ILesson extends Document {
  title: string;
  content: string;
  videoUrl?: string;
  course: Types.ObjectId;
  order: number;
  createdAt: Date;
  author: Types.ObjectId;
}

export interface IComment {
  user: Types.ObjectId;
  userModel: 'Student' | 'Teacher';
  lesson: Types.ObjectId;
  text: string;
  createdAt: Date;
}

export interface IEnrollment extends Document {
  student: Types.ObjectId;
  course: Types.ObjectId;
  completedLessons: Types.ObjectId[];
  createdAt: Date;
}
