import { Router } from "express";
import { protectRoute } from "root/src/middlewares/authMiddleware";
import validateRequestParameters from "root/src/validation";
import { createCategoryValidator, getAllCategoriesValidator, getCategoryByIdValidator, updateCategoryValidator } from "root/src/validation/categoryValidator";
import { createCategory, deleteCategory, getAllCategories, getCategoryById, updateCategory } from "../controllers/categoriesController";


const categoriesRouter = Router();

categoriesRouter.post("/create", protectRoute, validateRequestParameters(createCategoryValidator, "body"), createCategory);

categoriesRouter.patch("/update/:id", protectRoute, validateRequestParameters(updateCategoryValidator, "body"), updateCategory);

categoriesRouter.get("/get-all", protectRoute, validateRequestParameters(getAllCategoriesValidator, "query"), getAllCategories);

categoriesRouter.get("/get-by-id/:id", protectRoute, validateRequestParameters(getCategoryByIdValidator, "params"), getCategoryById);

categoriesRouter.delete("/delete/:id", protectRoute, 
  //validateRequestParameters(deleteSavingsValidator, "params"), 
  deleteCategory);