import {NextApiRequest, NextApiResponse} from "next";
import clientPromise from "../../lib/mongodb";
const requestIp = require('request-ip');

const rateLimit = {
    max: 5,
    time: 60 * 1000,
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!process.env.MONGODB_URI) {
        console.error("MONGODB URI IS NOT CONFIGURED!");
        res.status(500).json({error: "MongoDB URI is not configured."});
    }

    // Throttle the requests based on IP to five per minute to prevent abuse.
    const db = (await clientPromise).db("resell");
    const requests = db.collection("requests");
    const ip = requestIp.getClientIp(req);

    // Check if the IP has made more than five requests in the last minute.
    const count = await requests.countDocuments({
        ip: ip,
        date: {
            $gt: new Date(new Date().getTime() - rateLimit.time)
        }
    });

    if ((count + 1) >= rateLimit.max) {
        return res.status(429).json({error: "Moc požadavků. Prosím počkejte chvíli."});
    }

    requests.insertOne({ip: ip, date: new Date()});

    const action = req.query.action;
    if (!action || action === "") return res.status(400).json({ error: 'You must specify action.' });

    if (action === "checkValidity") {
        const pin: string | undefined = req.query.pin as string;
        if (!pin || pin === "") return res.status(400).json({ error: 'You must specify code.' });

        const pins = db.collection("pins");
        // log all pins.
        console.log((await pins.find({}).toArray()));
        console.log(pin);

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