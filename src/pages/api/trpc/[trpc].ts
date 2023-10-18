import * as trpcNext from '@trpc/server/adapters/next';
import {appRouter} from '../../../server/routers/_app';
import {createContext} from "../../../server/context";

// export API handler
// @see https://trpc.io/docs/api-handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: createContext,
  responseMeta() {
    return {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "http://localhost",
        "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
        "Access-Control-Allow-Headers":
          "Origin, X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, authorization",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Request-Method": "*",
      },
    };
  },
  onError:
    process.env.NODE_ENV === "development"
      ? ({path, error}) => {
        console.error(`❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`);
      }
      : undefined,
});