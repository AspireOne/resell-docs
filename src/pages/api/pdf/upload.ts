import {NextApiRequest, NextApiResponse} from "next";
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import {NextRequest} from "next/server";

export default async function handler(
  request: NextRequest,
  response: NextApiResponse,
) {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (
        pathname: string,
        /* clientPayload?: string, */
      ) => {
        // Generate a client token for the browser to upload the file

        // ⚠️ Authenticate users before generating the token.
        // Otherwise, you're allowing anonymous uploads.

        // const { user } = await auth(request);
        // const userCanUpload = canUpload(user, pathname);
        /*if (!userCanUpload) {
          throw new Error('Not authorized');
        }*/

        return {
          allowedContentTypes: ['application/pdf'],
          tokenPayload: JSON.stringify({
            // optional, sent to your server on upload completion
            ping: "pong"
          }),
        };
      },

      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Get notified of client upload completion
        // ⚠️ This will not work on `localhost` websites,
        // Use ngrok or similar to get the full upload flow

        console.log('blob upload completed', blob, tokenPayload);

        try {
          // Run any logic after the file upload completed
          // const { userId } = JSON.parse(tokenPayload);
          // await db.update({ avatar: blob.url, userId });
        } catch (error) {
          throw new Error('Could not update user');
        }
      },
    });

    return response.status(200).json(jsonResponse);
  } catch (error) {
    // The webhook will retry 5 times waiting for a 200
    return response.status(400).json({ error: (error as Error).message });
  }
}