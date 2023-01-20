import {NextApiRequest, NextApiResponse} from "next";
import {Data} from "../../backend/Data";
import axios from "axios";

const base = "https://app.fakturoid.cz/api/v2/accounts/hynekkrausdev";
const urls = {
    newSubject: base + "/subjects.json",
    // subjects.json?email={email}
    getSubject: (email: string) => base + "/subjects/search.json?query=" + email,
    createExpense: base + "/expenses.json",
}

const headers = {
    "User-Agent": "ResellczVykupniFaktura (matejpesl1@gmail.com)",
    "Content-Type": "application/json",
    'Acess-Control-Allow-Origin':'*',
    'Authorization':`Bearer 86fc929be7493e7375a7531d44b4ad94105f813a`,
}

const auth = {
    username: "matejpesl1@gmail.com",
    password: "86fc929be7493e7375a7531d44b4ad94105f813a"
}

export default async function handler (req: NextApiRequest, res: NextApiResponse) {
    const action = req.query.action;
    if (!action || action === "") return res.status(400).json({ error: 'You must specify action.' });

    if (action === "getSubject") {
        const email: string | undefined = req.query.email as string;
        if (!email || email === "") return res.status(400).json({ error: 'You must specify email.' });
        return getSubject(email)
            .then(subject => res.status(200).json(subject))
            .catch(err => {
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
            .then(expense => res.status(200).json(expense))
            .catch(err => {
                console.log(err);
                res.status(500).json({error: err});
            });
    }

    return res.status(400).json({ error: 'Undefined action.' });
}

function getSubject(email: string) {
    return axios({url: urls.getSubject(email), method: 'GET', headers: headers, auth: auth })
        .then(res => res.data);
}

function createExpense(data: Data, subjectId: string | number, pdfEncoded?: string | null) {
    const body = {
        'subject_id': subjectId,
        /*"attachment": pdfEncoded ? "data:application/pdf;" + pdfEncoded : "",*/
        'currency': data.currency,
        "status": "paid", //TODO
        "issued_on": data.date,
        "description": "Náklad vytvořený automaticky pomocí resell výkupu.",
        "vat_price_mode": "from_total_with_vat",
        'lines': [
            {
                'name': data.shoeName,
                'quantity': 1,
                'unit_name': data.shoeName + " (velikost " + data.shoeSize + ")",
                'unit_price': data.price,
                'vat_rate': '21',
            }
        ]
    }

    console.log(pdfEncoded ? "data:application/pdf;base64," + pdfEncoded : "");

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