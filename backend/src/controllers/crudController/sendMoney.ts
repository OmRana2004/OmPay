import { Response } from "express";
import { AuthRequest } from "../../middlewares/authMiddleware";
import { prismaClient } from "../../db";

const sendMoney = async (req: AuthRequest, res: Response) => {
  try {
    const fromUserId = req.userId;
    const { to, amount } = req.body; 

    if (!fromUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!to || !amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid input" });
    }

    // Find receiver by EMAIL
    const toUser = await prismaClient.user.findUnique({
      where: { email: to },
    });

    if (!toUser) {
      return res.status(400).json({ message: "Recipient not found" });
    }

    if (fromUserId === toUser.id) {
      return res.status(400).json({ message: "Cannot send money to yourself" });
    }

    await prismaClient.$transaction(async (tx) => {
      const senderWallet = await tx.wallet.findUnique({
        where: { userId: fromUserId },
      });

      const receiverWallet = await tx.wallet.findUnique({
        where: { userId: toUser.id },
      });

      if (!senderWallet || !receiverWallet) {
        throw new Error("Wallet not found");
      }

      if (senderWallet.balance < amount) {
        throw new Error("Insufficient balance");
      }

      await tx.wallet.update({
        where: { userId: fromUserId },
        data: { balance: { decrement: amount } },
      });

      await tx.wallet.update({
        where: { userId: toUser.id },
        data: { balance: { increment: amount } },
      });

      await tx.transaction.create({
        data: {
          amount,
          fromId: fromUserId,
          toId: toUser.id,
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
