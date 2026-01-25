import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prismaClient } from "../../db";

const signup = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;

    // validation
    if (!firstName || !lastName || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // check existing user
    const existingUser = await prismaClient.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // atomic signup (user + wallet + phone)
    const user = await prismaClient.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          firstName,
          lastName,
          email,
          password: hashedPassword,
        },
      });

      // hardcoded initial balance
      await tx.wallet.create({
        data: {
          userId: newUser.id,
          balance: 6000,
        },
      });

      await tx.phoneNumber.create({
        data: {
          userId: newUser.id,
          number: phone,
        },
      });

      return newUser;
    });

    return res.status(201).json({
      success: true,
      message: "Signup successful",
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export default signup;
