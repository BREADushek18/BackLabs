import mongoose, { Schema, model, Document } from "mongoose";

export interface ICourseFavourite extends Document {
  userId: Schema.Types.ObjectId;
  courseId: Schema.Types.ObjectId;
}

const courseFavouriteSchema = new Schema<ICourseFavourite>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
  },
  { timestamps: true }
);

export const CourseFavouriteModel = model<ICourseFavourite>(
  "CourseFavourite",
  courseFavouriteSchema
);

// Автоматическое обновление счётчика favoritesCount у модели курса
courseFavouriteSchema.post("save", async function (doc) {
  const courseId = doc.courseId;
  const course = await mongoose.model("Course").findById(courseId);
  if (course) {
    course.favoritesCount = (course.favoritesCount || 0) + 1;
    await course.save();
  }
});

courseFavouriteSchema.post("findOneAndDelete", async function (doc) {
  if (!doc) return;
  const courseId = doc.courseId;
  const course = await mongoose.model("Course").findById(courseId);
  if (course && course.favoritesCount && course.favoritesCount > 0) {
    course.favoritesCount -= 1;
    await course.save();
  }
});
