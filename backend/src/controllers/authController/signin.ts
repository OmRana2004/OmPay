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
        message: "Email and password are required",
      });
    }

    // Find user
    const user = await prismaClient.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email",
      });
    }

    // Check password
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    // Create JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    // Set token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // prod = true, local = false
      sameSite: "none", //  MUST for Vercel + Render
      maxAge: 60 * 60 * 1000, // 1 hour
      path: "/", // recommended
    });

    // Success response (NO token in body)
    return res.status(200).json({
      message: "Signin successful",
    });
  } catch (error) {
    console.error("Signin error:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export default signin;
