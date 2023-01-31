import { z } from 'zod';
import {generalProcedure, router} from "../trpc";
import {createCode, isCodeValid, isPinValid} from "../utils";
import {TRPCError} from "@trpc/server";

export const pinsRouter = router({
    isPinValid: generalProcedure
        .input(
            z.object({
                pin: z.number().min(1, {message: "Pin is required."})
            })
        )
        .output(
            z.object({
                valid: z.boolean()
            })
        )
        .mutation(async ({input, ctx}) => {
            const valid = await isPinValid(input.pin, ctx);
            return {valid};
        }),
});

// export type definition of API
export type PinsRouter = typeof pinsRouter;