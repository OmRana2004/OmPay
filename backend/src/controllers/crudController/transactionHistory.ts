import { Response } from "express";
import { AuthRequest } from "../../middlewares/authMiddleware";
import { prismaClient } from "../../db";

const transactions = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId as string;

    // Safety check 
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    // Fetch all transactions of this user
    const transactions = await prismaClient.transaction.findMany({
      where: {
        OR: [
          { fromId: userId },
          { toId: userId },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Success response
    return res.status(200).json({
      message: "Transactions fetched successfully",
      transactions,
    });
  } catch (error) {
    console.error("Transaction Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export default transactions;
