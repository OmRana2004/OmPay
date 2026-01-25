import { RequestHandler, Router } from "express";
import signup from "../controllers/authController/signup";
import signin from "../controllers/authController/signin";
import authMiddleware from "../middlewares/authMiddleware";
import wallet from "../controllers/crudController/wallet";
import transaction from "../controllers/crudController/transaction";
import findUser from "../controllers/crudController/findUser";
import balance from "../controllers/crudController/balance";



const router = Router(); 
const AuthMiddleware = authMiddleware as unknown as RequestHandler;

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/wallet", AuthMiddleware, wallet as unknown as RequestHandler);
router.post("/transaction", AuthMiddleware, transaction as unknown as RequestHandler);
router.post("/user", findUser);
router.get("/balance", AuthMiddleware, balance as unknown as RequestHandler);

export default router;