import {  Router } from "express";
import signup from "../controllers/authController/signup";
import signin from "../controllers/authController/signin";



const router = Router(); 

router.post("/signup", signup);
router.post("/signin", signin);

export default router;