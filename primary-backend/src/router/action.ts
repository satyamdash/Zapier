import { Router, Request, Response } from "express";
import { prisma } from "../db";

const router = Router();    

router.get("/available", async (req: Request, res: Response) => {
    const actions = await prisma.availableAction.findMany();
    res.json(actions);
});

export const actionRouter = router;