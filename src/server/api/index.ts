import { Router, json, urlencoded } from "express";
import { userRouter } from "./user";
import cors from "cors"

const router = Router(); 

router.use(cors())
router.use(json())
router.use(urlencoded())
router.use('/users', userRouter);

//Fallback
router.use((_, res) => {
    return res.status(404).send({ message: "Not found" })
})

export { router as apiRouter }