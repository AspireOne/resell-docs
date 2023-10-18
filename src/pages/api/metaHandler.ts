import {NextApiRequest, NextApiResponse} from "next";

export default {
  public: (
    handler: (req: NextApiRequest, res: NextApiResponse) => any,
  ) => metaHandler(handler),
};

/**
 * A wrapper around a Next.js API handler that enabled CORS and various useful abstractions.
 * @param handler
 * @param options
 */
function metaHandler(
  handler: (req: NextApiRequest, res: NextApiResponse) => any,
  options?: {
    /** If true, the handler will require a user to be logged in and user field will not be null. */
    protected?: boolean;
  },
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost");
    res.setHeader("Access-Control-Request-Method", "*");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "content-type, authorization",
    );
    res.setHeader("Referrer-Policy", "no-referrer");
    res.setHeader("Access-Control-Allow-Credentials", "true");

    // CORS preflight check.
    if (req.method === "OPTIONS") {
      res.writeHead(200);
      return res.end();
    }

    return handler(req, res);
  };
}
