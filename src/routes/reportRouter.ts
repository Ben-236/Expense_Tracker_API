import { Router } from "express";
import { protectRoute } from "root/src/middlewares/authMiddleware";
import validateRequestParameters from "root/src/validation";
//import { } from "root/src/validation/reportValidator";