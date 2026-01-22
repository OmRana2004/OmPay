import { Response } from "express";
import { AuthRequest } from "../../middlewares/authMiddleware";
import { prismaClient } from "../../db";

const balance = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.userId as string;

        // Finding a wallet from userId
        const wallet = await prismaClient.wallet.findUnique({
            where: { userId },
        });

        // If no wallet
        if (!wallet) {
            return res.status(404).json({
                message: "Wallet not found"
            });
        }

        // Ab Return the user balance
        return res.status(200).json({
            balance: wallet.balance,
        });
    } catch (error) {
        console.log("Balance Error", error);
        return res.status(500).json({
            message: "Intenal server error"
        });
    }
};

export default balance;