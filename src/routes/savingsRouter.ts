import { Router } from "express";
import { protectRoute } from "root/src/middlewares/authMiddleware";
import validateRequestParameters from "root/src/validation";
import { createSavingsValidator, getAllSavingsValidator, getSavingsByIdValidator, updateSavingsValidator } from "root/src/validation/savingsValidator";
import { createSavings, deleteSavings, getAllSavings, getSavingsById, updateSavings } from "../controllers/savingsController";


const savingsRouter = Router();

savingsRouter.post("/create", protectRoute, validateRequestParameters(createSavingsValidator, "body"), createSavings);

savingsRouter.patch("/update/:id", protectRoute, validateRequestParameters(updateSavingsValidator, "body"), updateSavings);

savingsRouter.get("/get-all", protectRoute, validateRequestParameters(getAllSavingsValidator, "query"), getAllSavings);

savingsRouter.get("/get-by-id/:id", protectRoute, validateRequestParameters(getSavingsByIdValidator, "params"), getSavingsById);

savingsRouter.delete("/delete/:id", protectRoute, 
  //validateRequestParameters(deleteSavingsValidator, "params"), 
  deleteSavings);

export default savingsRouter;