import { inferAsyncReturnType } from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import clientPromise from "../lib/mongodb";
import {getServerAuthSession} from "../pages/api/auth/[...nextauth]";

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext(opts: trpcNext.CreateNextContextOptions) {
    const { req, res } = opts;

    const db = (await clientPromise).db("resell");
    const codes = db.collection("codes");
    const pins = db.collection("pins");
    const requests = db.collection("requests");
    const whitelistedEmails = db.collection("whitelist");

    const session = await getServerAuthSession({req, res});
    return {
        codes,
        pins,
        requests,
        req,
        res,
        whitelistedEmails,
        session
    }
}

export type Context = inferAsyncReturnType<typeof createContext>;