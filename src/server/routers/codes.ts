import { z } from 'zod';
import {generalProcedure, router} from "../trpc";
import {createCode, isCodeValid, isPinValid} from "../utils";
import {TRPCError} from "@trpc/server";

export const codesRouter = router({
    createCode: generalProcedure
        .input(
            z.object({
                pin: z.number().min(1, {message: "Pin is required."})
            })
        )
        .output(
            z.object({
                code: z.number()
            })
        )
        .mutation(async ({input, ctx}) => {
            if (!await isPinValid(input.pin, ctx)) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Neplatný PIN."
                })
            }

            const code = await createCode(ctx);
            return {code};
        }),

    getAllCodes: generalProcedure
        .input(
            z.object({
                pin: z.number().min(1, {message: "Pin is required."})
            })
        )
        .output(
            z.object({
                codes: z.array(
                    z.object({
                        code: z.number(),
                        createdAt: z.string(),
                    }
                ))
            })
        )
        .mutation(async ({input, ctx}) => {
            if (!await isPinValid(input.pin, ctx)) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Neplatný PIN."
                })
            }

            // get all documents from collection ctx.codes, map their "code" property to an array of numbers.
            const codes = (await ctx.codes.find({}).toArray()).map(c => {
                return {
                    code: Number(c.code),
                    createdAt: c.createdAt + ""
                }
            });

            return {codes};
        }),

    isCodeValid: generalProcedure
        .input(
            z.object({
                code: z.number().min(1, {message: "Code is required."})
            })
        )
        .output(
            z.object({
                valid: z.boolean()
            })
        )
        .mutation(async ({input, ctx}) => {
            const valid = await isCodeValid(input.code, ctx);
            return {valid};
        }),
});

// export type definition of API
export type CodesRouter = typeof codesRouter;