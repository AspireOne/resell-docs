import { z } from 'zod';
import {adminProcedure, generalProcedure, router} from "../trpc";
import {createCode, isCodeValid, isPinValid} from "../utils";
import {TRPCError} from "@trpc/server";

export const codesRouter = router({
    createCode: adminProcedure
        .output(
            z.object({
                code: z.number()
            })
        )
        .mutation(async ({input, ctx}) => {
            const code = await createCode(ctx);
            return {code};
        }),

    getAllCodes: adminProcedure
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
            // if valid, set it to cookies.
            if (valid) {
                ctx.res.setHeader("Set-Cookie", `code=${input.code}; path=/; expires=Thu, 01 Jan 2035 00:00:00 GMT`);
            }
            return {valid};
        }),
});

// export type definition of API
export type CodesRouter = typeof codesRouter;