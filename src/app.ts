import express from "express";
import { connectDB } from "./config/db";
import dotenv from "dotenv";
import { authRoutes } from "./routes/authRoutes";
import { pingRoutes } from "./routes/pingRoutes";
import courseRoutes from "./routes/courseRoutes";
import tagRoutes from "./routes/tagRoutes";
import courseFavouriteRoutes from "./routes/courseFavouriteRoutes";

dotenv.config();
const PORT = process.env.PORT || 3000;

connectDB();

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", pingRoutes);
app.use("/api", courseRoutes);
app.use("/api", tagRoutes);
app.use("/course-favourites", courseFavouriteRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
