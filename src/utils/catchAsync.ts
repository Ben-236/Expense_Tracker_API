import { Request, Response, NextFunction } from "express";

type asyncFunction = (req: Request, res: Response, next: NextFunction) => Promise<void>;

const catchAsync = (fn: asyncFunction) => (req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next);

export default catchAsync;
