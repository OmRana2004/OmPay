import { Request, Response } from "express";

const logout = (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // true in prod
  });

  return res.status(200).json({
    message: "Logged out successfully",
  });
};

export default logout;
