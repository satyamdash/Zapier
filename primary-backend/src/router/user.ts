import { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware";
import { signupSchema, loginSchema } from "../types";
import  {prisma}  from "../db";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";

const router = Router();    

router.post("/signup", async (req: any, res: any) => {
    console.log("signup route");
    const parsedData = signupSchema.safeParse(req.body);
    console.log(parsedData);
    if(!parsedData.success) {
        return res.status(400).json({ message: "Invalid data" });
    }

    const userExists = await prisma.user.findUnique({
        where: {
            email: parsedData.data.email,
        },
    });
    if(userExists) {
        return res.status(400).json({ message: "User already exists" });
    }

    const user = await prisma.user.create({
        data: {
            email: parsedData.data.email,
            password: parsedData.data.password,
            name: parsedData.data.name,
        },
    });

    res.status(200).json({ message: "Please verify your email" });
});

router.post("/login", async (req: any, res: any) => {
    console.log("login route");
    const parsedData = loginSchema.safeParse(req.body);
    console.log(parsedData);
    if(!parsedData.success) {
        return res.status(400).json({ message: "Invalid data" });
    }

    const userExists = await prisma.user.findUnique({
        where: {
            email: parsedData.data.email,
        },
    });

    if(!userExists) {
        return res.status(400).json({ message: "User does not exist" });
    }

    const token = jwt.sign({ id: userExists.id }, JWT_SECRET);

    res.json({ token: token });
});

router.get("/", authMiddleware, async (req: any, res: any) => {
    console.log("user route");
    // @ts-ignore
    console.log("--------------------------------");
    console.log(req.id);
    console.log("--------------------------------");
    const id = req.id;
    const user = await prisma.user.findFirst({
        where: {
            id: id,
        },
        select: {
            email: true,
            name: true,
        },
    });
    res.json({ user: user });
});


export const userRouter = router;