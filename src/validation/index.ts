import { Request, Response, NextFunction } from "express";
import * as Yup from "yup";
import { AnySchema } from "yup";
import codes from "../utils/statusCode";

export const validateRequestParameters =
  (schema: AnySchema, property: "body" | "query" | "params" = "body") =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = await schema.validate(req[property], {
        abortEarly: false,
        stripUnknown: true,
      });

      if (property === "query") {
        (req as any).validatedQuery = validated;
      } else if (property === "body") {
        (req as any).validatedBody = validated;
      } else if (property === "params") {
        (req as any).validatedParams = validated;
      }

      next();
    } catch (err: any) {
      res.status(codes.badRequest).json({
        success: false,
        message: "Validation failed",
        errors: err.errors,
      });
    }
  };

export default validateRequestParameters;

export const paginationValidation = Yup.object().shape({
  page: Yup.number().positive().default(1),
  perPage: Yup.number().positive().default(15),
});
