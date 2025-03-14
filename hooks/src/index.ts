import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const app = express();

app.use(express.json());

app.post("/hooks/catch/:userId/:zapId", async (req, res) => {
  const { userId, zapId } = req.params;
  const body  = req.body;
  await prisma.$transaction(async (tx) => {
    const zaprun = await tx.zapRun.create({
      data: {
        zapId: zapId,
        metadata: body,
      },
    });

    await tx.zapRunOutbox.create({
      data: {
        zapRunId: zaprun.id,
      },
    });
  });

  console.log(body);
  res.json({ message: "ok" });
});



app.listen(3002, () => {
  console.log("Server is running on port 3002");
});