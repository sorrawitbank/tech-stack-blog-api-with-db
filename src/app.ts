import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import adminRouter from "./routes/admin.route";
import authRoute from "./routes/auth.route";
import categoryRoute from "./routes/category.routes";
import postRouter from "./routes/post.route";
import userRouter from "./routes/user.route";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173", // Frontend local (Vite)
      "https://tech-stack-blog-tau.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);

app.get("/", (req, res) => {
  return res.status(200).json("Tech Stack Blog API with Database");
});

app.use("/admin", adminRouter);
app.use("/auth", authRoute);
app.use("/categories", categoryRoute);
app.use("/posts", postRouter);
app.use("/user", userRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err) {
    const status = err.status || 500;
    return res.status(status).json({
      message: err.message || "Something went wrong",
    });
  }

  next();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
