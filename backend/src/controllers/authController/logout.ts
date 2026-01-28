import { Request, Response } from "express";

const logout = (_req: Request, res: Response) => {
  // Clear auth cookie
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return res.status(200).json({
    message: "Logged out successfully",
  });
};

export default logout;
