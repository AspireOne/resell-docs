import { TRPCError, initTRPC } from '@trpc/server';
import { Context } from './context';
const requestIp = require('request-ip');

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<Context>().create();
// Base router and publicProcedure helpers

const rateLimit = {
    max: 7,
    perSeconds: 30,
}

const generalMiddleware = t.middleware(async ({ next, ctx }) => {
    if (!process.env.FAKTUROID_USERNAME || !process.env.FAKTUROID_API_KEY || !process.env.FAKTUROID_API_BASE) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Fakturoid API is not configured.' });
    }

    if (!process.env.FAKTUROID_TECHNIC_EMAIL) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Fakturoid technical email is not configured.' });
    }

    if (!process.env.MONGODB_URI) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'MongoDB is not configured.' });
    }

    await checkRate(ctx);

    return next({
        ctx: {ctx},
    });
});

async function checkRate(ctx: Context): Promise<void> {
    const ip = requestIp.getClientIp(ctx.req);

    // Check if the IP has made more than x requests in the last minute.
    const count = await ctx.requests.countDocuments({
        ip: ip,
        date: {
            $gt: new Date(new Date().getTime() - rateLimit.perSeconds * 1000)
        }
    });
    if ((count + 1) > rateLimit.max) {
        throw new TRPCError({ code: 'TOO_MANY_REQUESTS', message: 'Too many requests. Please wait for a bit.' });
    }

    await ctx.requests.insertOne({ip: ip, date: new Date()});
}

export const router = t.router;
export const middleware = t.middleware;
export const generalProcedure = t.procedure.use(generalMiddleware);