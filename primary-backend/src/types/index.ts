import { z } from "zod";

export const signupSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(1),
});


export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export const ZapCreateSchema = z.object({
    availableTriggerId: z.string(),
    triggerMetadata: z.any().optional(),
    actions: z.array(z.object({
        availableActionId: z.string(),
        actionMetadata: z.any().optional(),
    }))
});


