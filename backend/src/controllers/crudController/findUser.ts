import { Request, Response } from "express";
import { prismaClient } from "../../db";

const findUser = async (req: Request, res: Response) => {
    try {
        const { Phnum } = req.body;

        // Validation
        if (!Phnum) {
            return res.status(400).json({
                message: "Phone number is required",
            });
        }

        // Finding the user by there phone number 
        const users = await prismaClient.phoneNumber.findMany({
            where: {
                number: {
                    contains: Phnum,
                },
            },
            select: {
                number: true,
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });

        // if user not found
        if (users.length === 0) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Success response
        return res.status(200).json({
            message: "User found",
            users,
        });
    } catch (error) {
        console.error("Find User Error:", error);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

export default findUser;

