import { Router } from "express";
import { authMiddleware } from "../middleware";
import { ZapCreateSchema } from "../types";
import { prisma} from "../db";

const router = Router();

router.post("/", authMiddleware, async (req: any, res: any) => {
    console.log("zap create route");
    console.log(req.body);
    console.log(req.id);
    const id = parseInt(req.id);
    const parsedData = ZapCreateSchema.safeParse(req.body);
    
    if (!parsedData.success) {
        return res.status(411).json({
            message: "Incorrect inputs"
        });
    }   

    const zapId = await prisma.$transaction(async tx => {
        const zap = await prisma.zap.create({
            data: {
                userId: id,
                triggerId: "",
                actions: {
                    create: parsedData.data.actions.map((x, index) => ({
                        actionId: x.availableActionId,
                        sortingOrder: index,
                        metadata: x.actionMetadata
                    }))
                }
            }
        });

        const trigger = await tx.trigger.create({
            data: {
                triggerId: parsedData.data.availableTriggerId,
                zapId: zap.id,
            }
        });

        await tx.zap.update({
            where: {
                id: zap.id
            },
            data: {
                triggerId: trigger.id
            }
        })

        return zap.id;

    })
    return res.json({
        zapId
    })
})

router.get("/", authMiddleware, async (req: any, res: any) => {
    // @ts-ignore
    const id = req.id;
    const zaps = await prisma.zap.findMany({
        where: {
            userId: id
        },
        include: {
            actions: {
               include: {
                    type: true
               }
            },
            trigger: {
                include: {
                    type: true
                }
            }
        }
    });

    return res.json({
        zaps
    })
})

router.get("/:zapId", authMiddleware, async (req: any, res: any) => {
    //@ts-ignore
    const id = req.id;
    const zapId = req.params.zapId;

    const zap = await prisma.zap.findFirst({
        where: {
            id: zapId,
            userId: id
        },
        include: {
            actions: {
               include: {
                    type: true
               }
            },
            trigger: {
                include: {
                    type: true
                }
            }
        }
    });

    return res.json({
        zap
    })

})

router.delete("/", authMiddleware, async (req: any, res: any) => {
    const zapIds = req.body.ids;
    const id = req.id;

    await prisma.$transaction(async (tx) => {
        // First delete related triggers
        await tx.trigger.deleteMany({
            where: {
                zapId: {
                    in: zapIds
                }
            }
        });

        // Then delete related actions
        await tx.action.deleteMany({
            where: {
                zapId: {
                    in: zapIds
                }
            }
        });

        // Finally delete the zaps
        await tx.zap.deleteMany({
            where: {
                id: {
                    in: zapIds
                },
                userId: id
            }
        });
    });

    return res.json({
        message: "Zaps deleted successfully"
    });
})


export const zapRouter = router;