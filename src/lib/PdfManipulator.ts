import {PDFDocument, rgb} from "pdf-lib";
import axios from "axios";
import fontkit from "@pdf-lib/fontkit";
import {Data} from "./Data";

export default class PdfManipulator {
    private readonly items: {[key: string]: {text: string, pos: {x: number, y: number}}}
    private readonly signature: string;

    constructor(docProps: Data) {
        if (!docProps.signature) throw new Error("Tried to createpdf without signature provided.");

        this.signature = docProps.signature;
        this.items = {
            name: {text: docProps.nameOrCompany, pos: {x: 315, y: 461}},
            cin: {text: docProps.cin ? docProps.cin : "N/A", pos: {x: 315, y: 432}},
            address1: {text: `${docProps.street}`, pos: {x: 315, y: 402}},
            address2: {text: `${docProps.postalCode} ${docProps.city}`, pos: {x: 315, y: 387}},
            address3: {text: `${docProps.countryName}`, pos: {x: 315, y: 372}},
            email: {text: docProps.email, pos: {x: 315, y: 343}},
            productName: {text: `${docProps.shoeName} (velikost ${docProps.shoeSize})`, pos: {x: 75, y: 279}},
            productPrice: {text: `${docProps.price} ${docProps.currency}`, pos: {x: 300, y: 279}},
            bankAccount: {text: docProps.bankAccount || docProps.iban!, pos: {x: 158, y: 188}},
            date: {text: docProps.date, pos: {x: 75, y: 115}},
            signature: {text: "", pos: {x: 400, y: 115}},
        }
    }

    public async createPdf(): Promise<PDFDocument> {
        return axios.get('/invoice.pdf', { responseType: 'arraybuffer' })
            .then(async (originalPdfRaw) => {
                const pdf = await PDFDocument.load(originalPdfRaw.data);
                pdf.registerFontkit(fontkit);

                const pages = pdf.getPages();
                const page = pages[0];

                const fontRaw = await fetch("/Ubuntu-R.ttf").then((res) => res.arrayBuffer());
                const font = await pdf.embedFont(fontRaw);

                for (const item of Object.values(this.items)) {
                    if (item.text) {
                        page.drawText(item.text, {
                            x: item.pos.x,
                            y: item.pos.y,
                            font: font,
                            size: 11,
                            color: rgb(0, 0, 0),
                        });
                    }
                }

                const signatureImg = await pdf.embedPng(this.signature);

                page.drawImage(signatureImg, {
                    x: this.items.signature.pos.x,
                    y: this.items.signature.pos.y,
                    width: 90,
                    height: 30,
                })

                return pdf;
        });
    }
}