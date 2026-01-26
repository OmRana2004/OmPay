import { Request, Response } from "express";

const logout = (_req: Request, res: Response) => {
  //  Nothing to clear on server for header-based JWT
  return res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

export default logout;
