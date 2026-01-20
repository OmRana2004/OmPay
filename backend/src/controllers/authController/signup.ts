import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prismaClient } from "../../db";

const signup = async (req: Request, res: Response) => {
    try{
    const { firstName, lastName, email, password } = req.body;

    // Validate input
    if  (!firstName || !lastName || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        })
    }

    // Check if user already exists
    const existingUser = await prismaClient.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        return res.status(409).json({
            success: false,
            message: "Email aready exist",
        })
    }

    //Hased Password
    const hasedPassword = await bcrypt.hash(password, 10);

    // Create User
    const user = await prismaClient.user.create({
        data: {
            firstName,
            lastName,
            email,
            password: hasedPassword
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
        },
    });

    // Send response
    return res.status(201).json({
        success: true,
        message: "Signup Successful",
        user,
    });
} catch (error) {
    console.log("Signup Error", error);
    return res.status(500).json({
        success: false,
        message: "Internal Server Error"
    })
}
};

export default signup;