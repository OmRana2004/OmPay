import { RequestHandler, Router } from "express";
import signup from "../controllers/authController/signup";
import signin from "../controllers/authController/signin";
import authMiddleware from "../middlewares/authMiddleware";

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

// wallet
router.post("/wallet", AuthMiddleware, wallet as RequestHandler);
router.get("/balance", AuthMiddleware, balance as RequestHandler);

// users
router.post("/user", findUser);

// transactions
router.post("/transfer", AuthMiddleware, sendMoney as RequestHandler);
router.get("/transactions", AuthMiddleware, transactionHistory as RequestHandler);

export default router;
