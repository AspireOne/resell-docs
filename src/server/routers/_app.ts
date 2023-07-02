import { z } from 'zod';
import {generalProcedure, router} from "../trpc";
import {codesRouter} from "./codes";
import {pinsRouter} from "./pins";
import {fakturoidRouter} from "./fakturoid";
export const appRouter = router({
    codes: codesRouter,
    pins: pinsRouter,
    fakturoid: fakturoidRouter,
    hello: generalProcedure
        .input(z.object({name: z.string()}))
        .output(z.object({greeting: z.string()}))
        .query(({ input }) => {return {greeting: `Hello to ${input.name}`}}),
});

// export type definition of API
export type AppRouter = typeof appRouter;