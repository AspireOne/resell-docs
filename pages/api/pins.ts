import {NextApiRequest, NextApiResponse} from "next";
import clientPromise from "../../lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!process.env.MONGODB_URI) {
        console.error("MONGODB URI IS NOT CONFIGURED!");
        res.status(500).json({error: "MongoDB URI is not configured."});
    }

    const action = req.query.action;
    if (!action || action === "") return res.status(400).json({ error: 'You must specify action.' });

    if (action === "checkValidity") {
        const pin: string | undefined = req.query.pin as string;
        if (!pin || pin === "") return res.status(400).json({ error: 'You must specify code.' });

        const db = (await clientPromise).db("resell");
        const pins = db.collection("pins");

        return pins.findOne({pin: pin})
            .then((pin => {
                if (pin) return res.status(200).json({ valid: true });
                else return res.status(200).json({ valid: false });
            }))
            .catch(err => {
                return res.status(500).json({error: err});
            })
    }
}