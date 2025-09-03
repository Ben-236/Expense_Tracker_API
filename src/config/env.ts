import dotenv from "dotenv";
dotenv.config();
import * as Yup from "yup";

const envSchema = Yup.object({
   APP_NAME: Yup.string().required(),
   APP_EMAIL: Yup.string().email().required(),
   PORT: Yup.number().default(3310),

   DATABASE_URL: Yup.string().required(),

   NODE_ENV: Yup.string().oneOf(["development", "production"]).default("development"),

   JWT_SECRET: Yup.string().required(),
   JWT_TOKEN_EXPIRES: Yup.string().default("1d"),
   JWT_COOKIE_EXPIRES: Yup.string().default("1d"),

   FRONTEND_URL: Yup.string().url(),

   CLOUD_NAME: Yup.string().optional(),
   API_KEY: Yup.string().optional(),
   API_SECRET: Yup.string().optional(),

   EMAIL_HOST: Yup.string().required(),
   EMAIL_PORT: Yup.number().required(),
   EMAIL_USER: Yup.string().required(),
   EMAIL_PASS: Yup.string().required(),

}).noUnknown(true);

const envVars = envSchema.validateSync(process.env, {
   stripUnknown: true,
   abortEarly: false,
});

const config = {
   nodeEnv: envVars.NODE_ENV,

   port: envVars.PORT,

   appName: envVars.APP_NAME,
   appEmail: envVars.APP_EMAIL,

   jwtSecret: envVars.JWT_SECRET,
   jwtTokenExpires: envVars.JWT_TOKEN_EXPIRES,
   jwtCookieExpires: envVars.JWT_COOKIE_EXPIRES,
   frontendUrl: envVars.FRONTEND_URL,


   cloudName: envVars.CLOUD_NAME,
   apiKey: envVars.API_KEY,
   apiSecret: envVars.API_SECRET,

   emailHost: envVars.EMAIL_HOST,
   emailPort: envVars.EMAIL_PORT,
   emailUser: envVars.EMAIL_USER,
   emailPass: envVars.EMAIL_PASS,

};

export default config;
