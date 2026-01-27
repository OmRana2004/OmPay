import { Response } from "express";
import { AuthRequest } from "../../middlewares/authMiddleware";
import { prismaClient } from "../../db";

const me = async (req: AuthRequest, res: Response) => {
  try {
    // 🛑 Safety check (should never happen, but good practice)
    if (!req.userId) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }

    const user = await prismaClient.user.findUnique({
      where: { id: req.userId },
      select: {
        firstName: true,
        email: true, // optional but useful
      },
    });

    // 🛑 User deleted / invalid token edge case
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("Me API error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default me;
