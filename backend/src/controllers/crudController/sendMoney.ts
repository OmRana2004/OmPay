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

    let receiverUserId: string | null = null;

    /* ---------- EMAIL ---------- */
    if (to.includes("@")) {
      const user = await prismaClient.user.findUnique({
        where: { email: to },
      });

      if (!user) {
        return res.status(404).json({ message: "Recipient not found" });
      }

      receiverUserId = user.id;
    }

    /* ---------- PHONE ---------- */
    else {
      const phone = await prismaClient.phoneNumber.findUnique({
        where: { number: to },
      });

      if (!phone) {
        return res.status(404).json({ message: "Recipient not found" });
      }

      receiverUserId = phone.userId;
    }

    if (receiverUserId === fromUserId) {
      return res
        .status(400)
        .json({ message: "Cannot send money to yourself" });
    }

    /* ---------- TRANSACTION ---------- */
    const transaction = await prismaClient.$transaction(async (tx) => {
      const senderWallet = await tx.wallet.findUnique({
        where: { userId: fromUserId },
      });

      const receiverWallet = await tx.wallet.findUnique({
        where: { userId: receiverUserId! },
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
        where: { userId: receiverUserId! },
        data: { balance: { increment: amount } },
      });

      const txn = await tx.transaction.create({
        data: {
          amount,
          fromId: fromUserId,
          toId: receiverUserId!,
        },
      });

      return txn; // ✅ IMPORTANT
    });

    return res.status(200).json({
      message: "Money transferred successfully",
      transactionId: transaction.id, // ✅ frontend needs this
    });
  } catch (error: any) {
    console.error("Transfer Error:", error);
    return res.status(400).json({
      message: error.message || "Transaction failed",
    });
  }
};

export default sendMoney;
