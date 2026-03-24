import type { Request, Response } from "express";
import type { AdminUserBody, UserBody } from "../types/body";
import AppError from "../errors/AppError";
import AuthService from "../services/auth.service";
import UserService from "../services/user.service";

const UserController = {
  getAdmin: async (req: Request, res: Response) => {
    let result;

    try {
      result = await UserService.getAdmin();
    } catch {
      return res.status(500).json({
        message: "Server could not get admin because of database connection",
      });
    }

    if (!result) {
      return res.status(404).json({
        message: "Server could not find an admin",
      });
    }

    const adminResponse = {
      name: result.name,
      bio: result.bio,
      profilePic: result.profilePic,
    };

    return res.status(200).json(adminResponse)
  },

  updateUser: async (req: Request<{}, {}, { body: string }>, res: Response) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: Token missing" });
    }

    const body: UserBody = JSON.parse(req.body.body);
    const { name, username } = body;
    const file = req.file;
    let result;

    try {
      const user = await AuthService.getUser(token);

      result = await UserService.updateUser(
        user.data.user.id,
        name,
        username,
        file,
        undefined
      );
    } catch (error) {
      // Client error from service
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({
        message: "Server could not update user because of database connection",
      });
    }

    if (!result.rowCount) {
      return res.status(404).json({
        message: "Server could not find a requested user to update",
      });
    }

    return res.status(200).json({ message: "Updated user successfully" });
  },

  updateAdmin: async (
    req: Request<{}, {}, { body: string }>,
    res: Response
  ) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Unauthorized: Token missing" });
    }

    const body: AdminUserBody = JSON.parse(req.body.body);
    const { name, username, bio } = body;
    const file = req.file;
    let result;

    try {
      const user = await AuthService.getUser(token);

      result = await UserService.updateUser(
        user.data.user.id,
        name,
        username,
        file,
        bio
      );
    } catch (error) {
      // Client error from service
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({
        message:
          "Server could not update admin user because of database connection",
      });
    }

    if (!result.rowCount) {
      return res.status(404).json({
        message: "Server could not find a requested admin user to update",
      });
    }

    return res.status(200).json({ message: "Updated admin user successfully" });
  },
};

export default UserController;
