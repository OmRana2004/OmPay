import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prismaClient } from "../../db";

const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // 2. Find user
    const user = await prismaClient.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // 3. Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // 4. JWT secret
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined");
    }

    // 5. Generate token
    const token = jwt.sign(
      { userId: user.id },
      secret,
      { expiresIn: "1h" }
    );

    // 6. Success response
    return res.status(200).json({
      message: "Sign in successful",
      token,
    });

  } catch (error) {
    console.error("Signin Error:", error);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export default signin;
