import { Router } from "express";
import CategoryController from "../controllers/category.controller";

const categoryRoute = Router();

categoryRoute.get("/", CategoryController.getCategories);

export default categoryRoute;
