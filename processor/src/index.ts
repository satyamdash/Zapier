import { PrismaClient } from "@prisma/client";
import {Kafka} from "kafkajs";
const prisma = new PrismaClient();

const TOPIC_NAME = "zap-events"
const kafka = new Kafka({
    clientId: "outbox-processor",
    brokers: ["localhost:9092"]
})

async function main() {
    const producer = kafka.producer()
    await producer.connect()

    while(1)
        {
            const pendingZapruns = await prisma.zapRunOutbox.findMany({
                where: {},
                take:10
            })
             
            producer.send({
                topic: TOPIC_NAME,
                messages: pendingZapruns.map((zaprun) => ({
                    value: zaprun.zapRunId
                }))
            })
            
            await prisma.zapRunOutbox.deleteMany({
                where: {
                    id: {
                        in: pendingZapruns.map((zaprun) => zaprun.id)
                    }
                }
            })
            
        }
}


main()