import { RequestHandler, Router } from "express";
import signup from "../controllers/authController/signup";
import signin from "../controllers/authController/signin";
import authMiddleware from "../middlewares/authMiddleware";



const router = Router(); 
const AuthMiddleware = authMiddleware as unknown as RequestHandler;

router.post("/signup", signup);
router.post("/signin", signin);

export default router;