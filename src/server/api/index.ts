import { Router, json, urlencoded } from "express";
import { userRouter } from "./user";
import cors from "cors"

const router = Router(); 

router.use(cors())
router.use(json())
router.use(urlencoded())
router.use('/users', userRouter);

export { router as apiRouter }