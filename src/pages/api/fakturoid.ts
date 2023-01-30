import {NextApiRequest, NextApiResponse} from "next";
import {Data} from "../../lib/Data";
import axios from "axios";
import clientPromise from "../../lib/mongodb";
import CONSTANTS from "../../lib/Constants";
const nodemailer = require('nodemailer');

const base = process.env.FAKTUROID_API_BASE;
const urls = {
    // subjects.json?email={email}
    getSubject: (email: string) => base + "/subjects/search.json?query=" + email,
    createExpense: base + "/expenses.json",
    newSubject: base + "/subjects.json",
}

const headers = {
    "User-Agent": `ResellczVykupniFaktura (${process.env.FAKTUROID_TECHNIC_EMAIL ?? ""})`,
    'Authorization':`Bearer ${process.env.FAKTUROID_API_KEY ?? ""}`,
    "Content-Type": "application/json",
    'Acess-Control-Allow-Origin':'*',
}

const auth = {
    username: process.env.FAKTUROID_USERNAME ?? "",
    password: process.env.FAKTUROID_API_KEY ?? ""
}

if (!process.env.FAKTUROID_USERNAME || !process.env.FAKTUROID_API_KEY || !process.env.FAKTUROID_API_BASE) {
    console.error("SOME OR ALL FAKTUROID ENV SECRETS ARE NOT CONFIGURED!");
}

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
    if (!process.env.FAKTUROID_USERNAME || !process.env.FAKTUROID_API_KEY || !process.env.FAKTUROID_API_BASE) {
        console.error("SOME OR ALL FAKTUROID ENV SECRETS ARE NOT CONFIGURED!");
        res.status(500).json({error: "Fakturoid API is not configured."});
    }

    const action = req.query.action;
    if (!action || action === "") return res.status(400).json({ error: 'You must specify action.' });

    // check code.
    if (!req.query.code) return res.status(400).json({ error: 'You must specify code.' });

    const db = (await clientPromise).db("resell");
    const codes = db.collection("codes");
    const row = await codes.findOne({code: req.query.code});

    if (!row) return res.status(400).json({ error: 'Code is not valid.' });

    if (action === "getSubject") {
        const email: string | undefined = req.query.email as string;
        if (!email || email === "") return res.status(400).json({ error: 'You must specify email.' });
        return getSubject(email)
            .then(subject => res.status(200).json(subject))
            .catch(err => {
                console.log("ATTEMPT TO SHOW ERRORS: ");
                console.error(err?.response?.data?.errors);
                console.error(err?.response?.errors);
                console.error(err?.data?.errors);
                console.error(err?.errors);
                console.log(err);
                res.status(500).json({error: err});
            });
    }

    if (action === "createSubject") {
        const data: Data = req.body.data.data;
        if (!data) return res.status(400).json({ error: 'You must specify Data.' });
        return createSubject(data)
            .then(subject => res.status(200).json(subject))
            .catch(err => {
                console.log("ATTEMPT TO SHOW ERRORS: ");
                console.error(err?.response?.data?.errors);
                console.error(err?.response?.errors);
                console.error(err?.data?.errors);
                console.error(err?.errors);
                console.log(err);
                res.status(500).json({error: err});
            });
    }

    if (action === "createExpense") {
        const data: Data = req.body.data.data;
        if (!data) return res.status(400).json({ error: 'You must specify Data.' });
        const subjectId: number | string = req.body.data.subjectId;
        if (!subjectId) return res.status(400).json({ error: 'You must specify subjectId.' });
        const pdfEncoded: string | null | undefined = req.body.data.pdfEncoded;
        return createExpense(data, subjectId, pdfEncoded)
            .then(expense => {
                if (req.query.code != CONSTANTS.specialErrorCode) {
                    try {
                        // Remove the code from DB.
                        codes.deleteOne({code: req.query.code});
                    } catch (e) {
                        console.log("Could not remove code from database.");
                    }
                }

                return res.status(200).json(expense);
            })
            .catch(err => {
                console.log(err);
                console.log("ATTEMPT TO SHOW ERRORS: ");
                console.error(err?.response?.data?.errors);
                console.error(err?.response?.errors);
                console.error(err?.data?.errors);
                console.error(err?.errors);
                res.status(500).json({error: err});
            });
    }

    return res.status(400).json({ error: 'Undefined action.' });
}

function sendMail(pdfEncoded: string, data: Data, to: string) {
    let transporter = nodemailer.createTransport({
        host: 'smtp.sendgrid.net',
        port: 587,
        auth: {
            user: "apikey",
            pass: process.env.SENDGRID_API_KEY
        }
    })

    transporter.sendMail({
        from: process.env.SENDGRID_FROM,
        to: to,
        subject: "Výkupní faktura",
        text: `Dobrý den, \n\nV příloze naleznete výkupní fakturu od ${data.nameOrCompany} (${data.shoeName}, velikost ${data.shoeSize}). \n\nResell.cz`,
        attachments: [
            {
                filename: 'faktura.pdf',
                content: pdfEncoded,
                encoding: 'base64',
                contentType: 'application/pdf'
            }
        ]
    }, function(error: any, info: any) {
        if (error)
            throw error;
        else
            console.log('Email sent: ' + info.response);
    });
}

function getSubject(email: string) {
    return axios({url: urls.getSubject(email), method: 'GET', headers: headers, auth: auth })
        .then(res => res.data);
}

function createExpense(data: Data, subjectId: string | number, pdfEncoded?: string | null) {

    const body = {
        'subject_id': subjectId,
        "attachment": pdfEncoded ? pdfEncoded : "",
        'currency': data.currency,
        "status": "paid",
        "issued_on": data.date,
        "description": "Náklad vytvořený automaticky pomocí resell výkupu.",
        "vat_price_mode": "from_total_with_vat",
        'lines': [
            {
                'name': data.shoeName + " (velikost " + data.shoeSize + ")",
                'quantity': 1,
                'unit_name': "",
                'unit_price': data.price,
                'vat_rate': '0',
            }
        ]
    }

    return axios({url: urls.createExpense, method: 'POST', headers: headers, auth: auth, data: body })
        .then(res => res.data);
}

function createSubject(data: Data) {
    const body = {
        "type": "supplier",
        'full_name': data.nameOrCompany,
        'name': data.nameOrCompany,
        'email': data.email,
        'street': data.street,
        "zip": data.postalCode,
        'city': data.city,
        'country': data.countryCode,
        'registration_no': data.cin,
        'bank_account': data.bankAccount,
        'iban': data.iban,
        //'variable_symbol': '1234567890',
    };

    return axios({url: urls.newSubject, method: 'POST', headers: headers, auth: auth, data: body })
        .then(res => res.data);
}