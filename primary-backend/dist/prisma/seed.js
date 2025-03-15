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
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../src/db");
function SeedUsers() {
    return __awaiter(this, void 0, void 0, function* () {
        yield db_1.prisma.availableTrigger.create({
            data: {
                id: "webhook",
                name: "webhook",
                image: "https://media.licdn.com/dms/image/v2/D4D12AQHtrdLcx2NuzQ/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1709325806317?e=2147483647&v=beta&t=DUaFfcSvxvwZCn00XhUncL3j8xFHJaSI_pcyYBrqX_4",
            }
        });
        yield db_1.prisma.availableAction.create({
            data: {
                id: "email",
                name: "SendEmail",
                image: "https://cdn.pixabay.com/photo/2017/11/10/05/42/email-2935508_1280.png",
            },
        });
        yield db_1.prisma.availableAction.create({
            data: {
                id: "sol",
                name: "SendSolana",
                image: "https://www.chainalysis.com/wp-content/uploads/2022/08/shutterstock-2176242673-scaled-1-1500x970.jpg",
            }
        });
    });
}
SeedUsers();
