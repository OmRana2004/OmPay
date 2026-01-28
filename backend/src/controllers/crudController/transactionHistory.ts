import { Response } from "express";
import { AuthRequest } from "../../middlewares/authMiddleware";
import { prismaClient } from "../../db";

const transactionHistory = async (req: AuthRequest, res: Response) => {
  try {
    // Safety check (middleware ke baad bhi good practice)
    if (!req.userId) {
      return res.status(401).json({
        message: "Not authenticated",
      });
    }

    const userId = req.userId;

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
      include: {
        from: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        to: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return res.status(200).json({
      userId,
      transactions,
    });
  } catch (error) {
    console.error("Transaction history error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default transactionHistory;
