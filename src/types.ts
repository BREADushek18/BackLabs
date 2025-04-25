import { Types } from "mongoose";

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
  _id: Types.ObjectId;
  title: string;
  slug: string;
  description?: string;
  price: number;
  image: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  published: boolean;
  author: Types.ObjectId;
  createdAt: Date;
}
