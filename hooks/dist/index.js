"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.post("/hooks/catch/:userId/:zapId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, zapId } = req.params;
    const { data } = req.body;
    yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const zaprun = yield tx.zaprun.create({
            data: {
                zapId: zapId,
                metadata: data,
            },
        });
        yield tx.zaprunOutbox.create({
            data: {
                zaprunId: zaprun.id,
            },
        });
    }));
    console.log(data);
    res.send("ok");
}));
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
