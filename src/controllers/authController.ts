import { Request, Response } from "express";
import { StudentModel } from "../models/student";
import { TeacherModel } from "../models/teacher";
import { authService } from "../services/authService";
import { IStudent, ITeacher } from "../types/types";

const register = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, username, password, role } = req.body;

    if (!firstName || !lastName || !username || !password || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (role !== "student" && role !== "teacher") {
      return res.status(400).json({ error: "Invalid role" });
    }

    const user = await authService.registerUser(
      firstName,
      lastName,
      username,
      password,
      role
    );
    const token = authService.generateToken(user._id.toString(), role);

    res.status(201).json({ token });
  } catch (err) {
    const error = err as Error;
    res.status(400).json({ error: error.message });
  }
};

const login = async (req: Request, res: Response) => {
  const { username, password, role } = req.body;

  let user: IStudent | ITeacher | null;

  if (role === "student") {
    user = (await StudentModel.findOne({ username })) as IStudent;
  } else if (role === "teacher") {
    user = (await TeacherModel.findOne({ username })) as ITeacher;
  } else {
    res.status(400).json({ error: "Invalid role" });
    return;
  }

  if (!user || !(await user.comparePassword(password))) {
    res.status(400).json({ error: "Invalid credentials" });
    return;
  }

  const token = authService.generateToken(user._id.toString(), role);
  res.status(200).json({ token });
};

const getProfile = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { userId, role } = req;

    if (!userId || !role) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const model = role === "student" ? StudentModel : TeacherModel;
    const user = await model.findById(userId).select("-password").lean();

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ ...user, role });
  } catch (err) {
    console.error("Error in getProfile:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const deleteUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { userId, role } = req;

    if (!userId || !role) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const model = role === "student" ? StudentModel : TeacherModel;
    const result = await model.findByIdAndDelete(userId);

    if (!result) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(204).send();
  } catch (err) {
    console.error("Error in deleteUser:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const authController = {
  register,
  login,
  getProfile,
  deleteUser,
};
