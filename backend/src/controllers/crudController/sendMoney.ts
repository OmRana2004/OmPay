import { Response } from "express";
import { AuthRequest } from "../../middlewares/authMiddleware";
import { prismaClient } from "../../db";

const sendMoney = async (req: AuthRequest, res: Response) => {
  try {
    const fromUserId = req.userId;
    const { toId, amount } = req.body;

    // Basic validation
    if (!fromUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!toId || !amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid input" });
    }

    if (fromUserId === toId) {
      return res.status(400).json({ message: "Cannot send money to yourself" });
    }

    // Atomic operation
    await prismaClient.$transaction(async (tx) => {
      const senderWallet = await tx.wallet.findUnique({
        where: { userId: fromUserId },
      });

      const receiverWallet = await tx.wallet.findUnique({
        where: { userId: toId },
      });

      if (!senderWallet || !receiverWallet) {
        throw new Error("Wallet not found");
      }

      if (senderWallet.balance < amount) {
        throw new Error("Insufficient balance");
      }

      // Deduct from sender
      await tx.wallet.update({
        where: { userId: fromUserId },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });

      // Add to receiver
      await tx.wallet.update({
        where: { userId: toId },
        data: {
          balance: {
            increment: amount,
          },
        },
      });

      // Create transaction record
      await tx.transaction.create({
        data: {
          amount,
          fromId: fromUserId,
          toId,
        },
      });
    });

    return res.status(200).json({
      message: "Money transferred successfully",
    });
  } catch (error: any) {
    return res.status(400).json({
      message: error.message || "Transaction failed",
    });
  }
};

export default sendMoney;
