import { Response } from "express";
import { AuthRequest } from "../../middlewares/authMiddleware";
import { prismaClient } from "../../db";

const balance = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    const wallet = await prismaClient.wallet.findUnique({
      where: { userId },
      select: { balance: true }, 
    });

    if (!wallet) {
      return res.status(404).json({
        message: "Wallet not found",
      });
    }

    return res.status(200).json({
      balance: wallet.balance,
    });
  } catch (error) {
    console.error("Balance Error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default balance;
