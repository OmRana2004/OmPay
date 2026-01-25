import { Response } from "express";
import { AuthRequest } from "../../middlewares/authMiddleware";
import { prismaClient } from "../../db";

const me = async (req: AuthRequest, res: Response) => {
  const user = await prismaClient.user.findUnique({
    where: { id: req.userId },
    select: { firstName: true },
  });

  return res.json(user);
};

export default me;