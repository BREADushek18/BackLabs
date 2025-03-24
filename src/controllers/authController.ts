import { Request, Response } from "express";
import { StudentModel } from "../models/student";
import { TeacherModel } from "../models/teacher";
import { authService } from "../services/authService";
import { IStudent, ITeacher } from "../types";

const register = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, username, password, role } = req.body;

    let user;
    if (role === "student") {
      user = new StudentModel({ firstName, lastName, username, password });
    } else if (role === "teacher") {
      user = new TeacherModel({ firstName, lastName, username, password });
    } else {
      res.status(400).json({ error: "Invalid role" });
      return;
    }

    await user.save();
    const token = authService.generateToken(user._id.toString());
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

  const token = authService.generateToken(user._id.toString());
  res.status(200).json({ token });
};

const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const user = await authService.getUserById(userId);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (err) {
    console.error("Error in getProfile:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    await authService.deleteUser(userId);
    res.status(204).send();
  } catch (err) {
    console.error("Error in deleteUser:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const authController = {
  register,
  login,
  getProfile,
  deleteUser,
};
