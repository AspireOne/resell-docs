import { inferAsyncReturnType } from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import clientPromise from "../lib/mongodb";

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext(opts: trpcNext.CreateNextContextOptions) {
    const db = (await clientPromise).db("resell");
    const codes = db.collection("codes");
    const pins = db.collection("pins");
    const requests = db.collection("requests");

    return {
        codes, pins, requests, req: opts.req
    }
}

export type Context = inferAsyncReturnType<typeof createContext>;