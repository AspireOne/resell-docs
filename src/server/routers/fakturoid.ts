import { z } from 'zod';
import {generalProcedure, router} from "../trpc";
import {createCode, isCodeValid, isPinValid, removeCode} from "../utils";
import {TRPCError} from "@trpc/server";
import axios from "axios";
import {Data} from "../../lib/Data";

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

const DataSchema = z.object({
    nameOrCompany: z.string(),
    email: z.string(),
    street: z.string(),
    city: z.string(),
    countryCode: z.string(),
    countryName: z.string(),
    postalCode: z.string(),
    shoeName: z.string(),
    shoeSize: z.string(),
    price: z.string(),
    currency: z.string(),
    cin: z.string(),
    bankAccount: z.string(),
    iban: z.string(),
    date: z.string(),
})

export const fakturoidRouter = router({
    getSubject: generalProcedure
        .input(
            z.object({
                code: z.number().min(1, {message: "Code is required."}),
                email: z.string().email({message: "Email is required and must be valid."})
            })
        )
        .output(
            z.object({
                subject: z.any()
            })
        )
        .query(async ({input, ctx}) => {
            const valid = isCodeValid(input.code, ctx);
            if (!valid) throw new TRPCError({code: "BAD_REQUEST", message: "Code is not valid."});
            const subject = await axios({
                url: urls.getSubject(input.email),
                method: 'GET',
                headers: headers,
                auth: auth
            }).then(res => res.data);

            return {subject};
        }),

    createSubject: generalProcedure
        .input(
            z.object({
                code: z.number().min(1, {message: "Code is required."}),
                data: DataSchema
            })
        )
        .output(
            z.object({
                subject: z.any()
            })
        )
        .mutation(async ({input, ctx}) => {
            const valid = isCodeValid(input.code, ctx);
            if (!valid) throw new TRPCError({code: "BAD_REQUEST", message: "Code is not valid."});

            const subject = await createSubject(input.data);
            return {subject};
        }),

    createExpense: generalProcedure
        .input(
            z.object({
                code: z.number().min(1, {message: "Code is required."}),
                data: DataSchema,
                // zod subjectId string or number.
                subjectId: z.union([z.string().min(1), z.number().min(1)]).optional(),
                pdfEncoded: z.string().optional()
            })
        )
        .output(
            z.object({
                expense: z.any()
            })
        )
        .mutation(async ({input, ctx}) => {
            const valid = isCodeValid(input.code, ctx);
            if (!valid) throw new TRPCError({code: "BAD_REQUEST", message: "Invalid code."});

            let subject: undefined | {[key:string]: string};
            if (!input.subjectId) {
                const subjects = await getSubject(input.data.email);
                subject = subjects[0];
                if (!subject) subject = await createSubject(input.data);
                if (!subject) throw new TRPCError({code: "INTERNAL_SERVER_ERROR", message: "Could not get or create subject."});
            }

            const expense = await createExpense(input.data, input.subjectId ?? subject!.id, input.pdfEncoded);
            await removeCode(input.code, ctx);
            return {expense};
        })
})
async function createExpense(data: z.infer<typeof DataSchema>, subjectId: string | number, pdfEncoded?: string | null): Promise<any> {
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

    return axios({
        url: urls.createExpense,
        method: 'POST',
        headers: headers,
        auth: auth,
        data: body
    })
        .then(res => res.data);
}

async function getSubject(email: string): Promise<any> {
    return axios({
        url: urls.getSubject(email),
        method: 'GET',
        headers: headers,
        auth: auth
    }).then(res => res.data);
}

async function createSubject(data: z.infer<typeof DataSchema>): Promise<any> {
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

    return axios({
        url: urls.newSubject,
        method: 'POST',
        headers: headers,
        auth: auth,
        data: body
    }).then(res => res.data);
}

// export type definition of API
export type FakturoidRouter = typeof fakturoidRouter;