import express from "express";
import cors from "cors";
import { userRouter } from "./router/user";
import { zapRouter } from "./router/zap";
import { triggerRouter } from "./router/trigger";
import { actionRouter } from "./router/action";

const app = express();
app.use(express.json());

app.use(cors());



app.use("/api/v1/user", userRouter);

app.use("/api/v1/zap", zapRouter);

app.use("/api/v1/action", actionRouter);
app.use("/api/v1/trigger", triggerRouter);

app.listen(3000 , () => {
    console.log("Server is running on port 3000");
});