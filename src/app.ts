import express from "express";
import cors from "cors";
import postRouter from "./routes/postRoute";

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
  return res.status(200).json({ message: "Tech Stack Blog API with Database" });
});

app.use("/posts", postRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
