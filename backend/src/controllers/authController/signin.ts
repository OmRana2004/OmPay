import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prismaClient } from "../../db";

const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user
    const user = await prismaClient.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // JWT Secret
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      console.error("JWT_SECRET is missing in .env");
      return res.status(500).json({
        success: false,
        message: "Server configuration error",
      });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id },
      secret,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      success: true,
      message: "Signin successful ",
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Signin Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export default signin;
