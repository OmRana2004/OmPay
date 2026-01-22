import { Response } from "express";
import { AuthRequest } from "../../middlewares/authMiddleware";
import { prismaClient } from "../../db";

const wallet = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId as string;
    const { Phnum, amount } = req.body;

    // Validate input
    if (!Phnum || amount === undefined) {
      return res.status(400).json({
        message: "Required data is missing",
      });
    }

    // Check if phone number already exists
    const existingPhone = await prismaClient.phoneNumber.findUnique({
      where: { number: Phnum },
    });

    if (existingPhone) {
      return res.status(409).json({
        message: "Phone number already in use",
      });
    }

    // Atomic DB operation
    await prismaClient.$transaction([
      prismaClient.phoneNumber.create({
        data: {
          number: Phnum,
          userId,
        },
      }),
      prismaClient.wallet.create({
        data: {
          userId,
          balance: amount,
        },
      }),
    ]);

    // Success response
    return res.status(201).json({
      message: "Wallet created successfully",
    });
  } catch (error) {
    console.error("Wallet Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export default wallet;
