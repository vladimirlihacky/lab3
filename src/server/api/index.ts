import { Router, json, urlencoded } from "express";
import { userRouter } from "./user";
import cors from "cors"
import { authRouter } from "./auth";
import cookieParser from "cookie-parser";
import passport from "passport";

const router = Router(); 

router.use(cors())
router.use(cookieParser())
router.use(passport.initialize())
router.use(json())
router.use(urlencoded())
router.use('/users', userRouter);
router.use('/auth', authRouter);

//Fallback
router.use((_, res) => {
    return res.status(404).send({ message: "Not found" })
})

export { router as apiRouter }