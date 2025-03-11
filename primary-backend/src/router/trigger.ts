import { Router, Request, Response } from "express";
import  {prisma}  from "../db";


const router = Router();    

router.get("/available", async (req: Request, res: Response) => {
    const triggers = await prisma.availableTrigger.findMany();
    res.json(triggers);
});

export const triggerRouter = router;