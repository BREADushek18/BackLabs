import { Schema, model } from 'mongoose';

export interface ITag {
  _id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: Date;
}

const tagSchema = new Schema<ITag>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const TagModel = model<ITag>('Tag', tagSchema);
