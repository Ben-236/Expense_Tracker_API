import { Router } from "express";
import { protectRoute } from "root/src/middlewares/authMiddleware";
import validateRequestParameters from "root/src/validation";
import { createBudgetValidator, getAllBudgetsValidator, getBudgetByIdValidator, updateBudgetValidator } from "root/src/validation/budgetValidation";
import { createBudget, deleteBudget, getAllBudgets, getBudgetById, updateBudget } from "../controllers/budgetController";


const budgetRouter = Router();

budgetRouter.post("/create", protectRoute, validateRequestParameters(createBudgetValidator, "body"), createBudget);

budgetRouter.patch("/update/:id", protectRoute, validateRequestParameters(updateBudgetValidator, "body"), updateBudget);

budgetRouter.get("/get-all", protectRoute, validateRequestParameters(getAllBudgetsValidator, "query"), getAllBudgets);

budgetRouter.get("/get-by-id/:id", protectRoute, validateRequestParameters(getBudgetByIdValidator, "params"), getBudgetById);

budgetRouter.delete("/delete/:id", protectRoute, 
  //validateRequestParameters(deleteSavingsValidator, "params"), 
  deleteBudget);