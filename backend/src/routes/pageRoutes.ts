import { RequestHandler, Router } from "express";
import signup from "../controllers/authController/signup";
import signin from "../controllers/authController/signin";
import logout from "../controllers/authController/logout";
import authMiddleware from "../middlewares/authMiddleware";

import me from "../controllers/authController/me";
import wallet from "../controllers/crudController/wallet";
import sendMoney from "../controllers/crudController/sendMoney";
import transactionHistory from "../controllers/crudController/transactionHistory";
import findUser from "../controllers/crudController/findUser";
import balance from "../controllers/crudController/balance";

const router = Router();
const AuthMiddleware = authMiddleware as unknown as RequestHandler;

// auth
router.post("/signup", signup);
router.post("/signin", signin);
router.post("/logout", logout);

// wallet
router.post("/wallet", AuthMiddleware, wallet as RequestHandler);
router.get("/balance", AuthMiddleware, balance as RequestHandler);

// users
router.post("/user", findUser);

// transactions
router.post("/transfer", AuthMiddleware, sendMoney as RequestHandler);
router.get("/transactions", AuthMiddleware, transactionHistory as RequestHandler);
router.get("/me", AuthMiddleware, me);

export default router;
