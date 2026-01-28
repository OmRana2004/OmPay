import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prismaClient } from "../../db";

const signup = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;

    // Basic validation
    if (!firstName || !lastName || !email || !password || !phone) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Email format (basic safety)
    if (!email.includes("@")) {
      return res.status(400).json({
        message: "Invalid email address",
      });
    }

    // Check existing user (email)
    const existingUser = await prismaClient.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }

    //  Check existing phone
    const existingPhone = await prismaClient.phoneNumber.findUnique({
      where: { number: phone },
      select: { id: true },
    });

    if (existingPhone) {
      return res.status(409).json({
        message: "Phone number already exists",
      });
    }

    //  Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //  Atomic signup (user + wallet + phone)
    const user = await prismaClient.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          firstName,
          lastName,
          email,
          password: hashedPassword,
        },
      });

      // Initial balance (can be env-based later)
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
      message: "Signup successful",
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default signup;
