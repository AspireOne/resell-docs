import {NextApiRequest, NextApiResponse} from "next";
import clientPromise from "../../lib/mongodb";
import CONSTANTS from "../../backend/Constants";

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

        console.log(code);
        // log all codes.
        console.log((await codes.find({}).toArray()).find(c => c.code === code));
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
        // generate random number between 1000 and 9999.
        let code: string;
        do {
            code = Math.floor(1000 + Math.random() * 9000) + "";
        } while (code === CONSTANTS.specialAccessCode)

        return codes.insertOne({code: code})
            .then(() => res.status(200).json({ code: code }))
            .catch(err => res.status(500).json({ error: err }));
    }
}