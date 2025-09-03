import bcrypt from "bcrypt";
import config from "root/src/config/env";

export const comparePassword = async (
  password: string,
  adminPassword: string
): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, adminPassword);
  } catch (err) {
    if (err instanceof Error) {
      console.error("Password Comparison Error:", err.message);
    } else {
      console.error("Unknown Error in Password Comparison:", err);
    }
    return false;
  }
};

export const getFrontendUrl = (
  path: string,
  queryParams?: Record<string, string | number | boolean>
) => {
  const protocol = config.nodeEnv === "production" ? "https" : "http";
  const baseUrl = config.frontendUrl || "localhost:3310";

  const url = new URL(`${protocol}://${baseUrl}`);
  url.pathname = path;

  Object.entries(queryParams ?? {}).forEach(([key, value]) => {
    url.searchParams.append(key, value.toString());
  });

  return url.toString();
};

export const generateSerialNumber = async (): Promise<string> => {
  const companyPrefix = "REV";
  const yearPart = new Date().getFullYear().toString();

  const randomSegment = (length: number): string => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const midSection = randomSegment(6);
  const serialNumber = `${companyPrefix}-${midSection}-${yearPart}`;

  return serialNumber;
};
