import {NextApiRequest, NextApiResponse} from "next";
import clientPromise from "../../lib/mongodb";
import CONSTANTS from "../../backend/Constants";

const ExpireAfterDays = 7;
const expireAfterSeconds = ExpireAfterDays * 24 * 60 * 60;
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!process.env.MONGODB_URI) {
        console.error("MONGODB URI IS NOT CONFIGURED!");
        res.status(500).json({error: "MongoDB URI is not configured."});
    }

    const action = req.query.action;
    if (!action || action === "") return res.status(400).json({ error: 'You must specify action.' });

    const db = (await clientPromise).db("resell");
    const codes = db.collection("codes");

    if (action === "checkValidity") {
        const code: string | undefined = req.query.code as string;
        if (!code || code === "") return res.status(400).json({ error: 'You must specify code.' });

        return codes.findOne({code: code})
            .then((code => {
                if (code) return res.status(200).json({ valid: true });
                else return res.status(200).json({ valid: false });
            }))
            .catch(err => {
                return res.status(500).json({error: err});
            })
    }

    if (action === "createCode") {
        // get pin.
        const pin: string | undefined = req.query.pin as string;
        if (!pin || pin === "") return res.status(400).json({ error: 'You must specify pin.' });

        const allCodes = await codes.find({}).toArray();
        let code = "";
        do {
            code = Math.floor(1000 + Math.random() * 9000) + "";
        } while (allCodes.find(c => c.code === code));

        const pins = db.collection("pins");
        return pins.findOne({pin: pin})
            .then((pin => {
                if (!pin) return res.status(400).json({error: "Invalid pin."});
            }))
            /*.then(() => {
                return codes.createIndex({ "createdAt": 1 }, { expireAfterSeconds: expireAfterSeconds });
            })*/
            .then(() => {
                return codes.insertOne({code: code, createdAt: new Date()});
            })
            .then(() => {
                return res.status(200).json({ code: code });
            })
            .catch(err => {
                return res.status(500).json({error: err});
            })
    }
}