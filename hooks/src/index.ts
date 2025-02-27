import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const app = express();

app.use(express.json());

app.post("/hooks/catch/:userId/:zapId", async (req, res) => {
  const { userId, zapId } = req.params;
  const { data } = req.body;
  await prisma.$transaction(async (tx) => {
    const zaprun = await tx.zaprun.create({
      data: {
        zapId: zapId,
        metadata: data,
      },
    });

    await tx.zaprunOutbox.create({
      data: {
        zaprunId: zaprun.id,
      },
    });
  });

  console.log(data);
  res.send("ok");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});