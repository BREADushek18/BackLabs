import mongoose, { Schema } from "mongoose";
import slugify from "slugify";
import { ICourse } from "../types/types";

const courseSchema = new Schema<ICourse>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  level: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    default: "beginner",
    required: true,
  },
  published: { type: Boolean, default: false },
  author: { type: Schema.Types.ObjectId, ref: "Teacher", required: true },
  createdAt: { type: Date, default: Date.now },
});

courseSchema.pre("validate", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

export const CourseModel = mongoose.model<ICourse>("Course", courseSchema);
