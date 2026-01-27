import { Response } from "express";
import { AuthRequest } from "../../middlewares/authMiddleware";
import { prismaClient } from "../../db";

const sendMoney = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const fromUserId = req.userId;
    const { to, amount } = req.body;

    // 1️⃣ Input validation
    if (!to || typeof amount !== "number" || amount <= 0) {
      return res.status(400).json({ message: "Invalid input" });
    }

    let receiverUserId: string | null = null;

    // 2️⃣ Resolve receiver (email or phone)
    if (to.includes("@")) {
      const user = await prismaClient.user.findUnique({
        where: { email: to },
        select: { id: true },
      });

      if (!user) {
        return res.status(404).json({ message: "Recipient not found" });
      }

      receiverUserId = user.id;
    } else {
      const phone = await prismaClient.phoneNumber.findUnique({
        where: { number: to },
        select: { userId: true },
      });

      if (!phone) {
        return res.status(404).json({ message: "Recipient not found" });
      }

      receiverUserId = phone.userId;
    }

    // 3️⃣ Prevent self transfer
    if (receiverUserId === fromUserId) {
      return res
        .status(400)
        .json({ message: "Cannot send money to yourself" });
    }

    // 4️⃣ Atomic transaction
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

      // 🔒 Balance updates (atomic)
      await tx.wallet.update({
        where: { userId: fromUserId },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });

      await tx.wallet.update({
        where: { userId: receiverUserId! },
        data: {
          balance: {
            increment: amount,
          },
        },
      });

      // 🧾 Record transaction
      return tx.transaction.create({
        data: {
          amount,
          fromId: fromUserId,
          toId: receiverUserId!,
        },
      });
    });

    return res.status(200).json({
      message: "Money transferred successfully",
      transactionId: transaction.id,
    });
  } catch (error: any) {
    console.error("Send money error:", error);

    return res.status(400).json({
      message: error.message || "Transaction failed",
    });
  }
};

export default sendMoney;
