import { Response } from "express";
import { AuthRequest } from "../../middlewares/authMiddleware";
import { prismaClient } from "../../db";

const transactionHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId as string;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const transactions = await prismaClient.transaction.findMany({
      where: {
        OR: [{ fromId: userId }, { toId: userId }],
      },
      orderBy: { createdAt: "desc" },
      include: {
        from: {
          select: { firstName: true, lastName: true },
        },
        to: {
          select: { firstName: true, lastName: true },
        },
      },
    });

    return res.status(200).json({
      userId,
      transactions,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export default transactionHistory;
