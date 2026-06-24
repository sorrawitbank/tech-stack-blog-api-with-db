import type { Request, Response } from "express";
import type { CommentBody } from "../types/body";
import type { PostIdParams } from "../types/params";
import AppError from "../errors/AppError";
import AuthService from "../services/auth.service";
import CommentService from "../services/comment.service";

const CommentController = {
  createComment: async (
    req: Request<PostIdParams, {}, CommentBody>,
    res: Response
  ) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Token missing" });
    }

    const postId = Number(req.params.postId);
    const { comment } = req.body;

    try {
      const user = await AuthService.getUser(token);

      await CommentService.createComment(
        postId,
        user.data.user.id,
        comment.trim()
      );
    } catch (error) {
      // Client error from service
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }

      return res.status(500).json({
        message: "Server could not comment because of database connection",
      });
    }

    return res.status(200).json({ message: "Commented on post successfully" });
  },
};

export default CommentController;
