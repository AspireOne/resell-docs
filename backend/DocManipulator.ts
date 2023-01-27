import {PersonalInfoProps} from "../components/form_screens/FormPersonalInfoScreen";
import {ProductProps} from "../components/form_screens/FormProductScreen";
import {FinalProps} from "../components/form_screens/FormFinalScreen";
import {PDFDocument, rgb} from "pdf-lib";
import axios from "axios";
import fontkit from "@pdf-lib/fontkit";
import {Data} from "./Data";

export default class DocManipulator {
    private readonly fontUrl = 'https://pdf-lib.js.org/assets/ubuntu/Ubuntu-R.ttf';
    private readonly items: {[key: string]: {text: string, pos: {x: number, y: number}}}
    private readonly signature: string;

    constructor(docProps: Data) {
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
        return axios.get('/doc.pdf', { responseType: 'arraybuffer' })
            .then(async (response) => {
                const fontBytes = await fetch(this.fontUrl).then((res) => res.arrayBuffer());

                const pdfDoc = await PDFDocument.load(response.data);
                pdfDoc.registerFontkit(fontkit);
                const ubuntuFont = await pdfDoc.embedFont(fontBytes);

                const pages = pdfDoc.getPages();
                const page = pages[0];

                for (const item of Object.values(this.items)) {
                    if (item.text) {
                        page.drawText(item.text, {
                            x: item.pos.x,
                            y: item.pos.y,
                            font: ubuntuFont,
                            size: 11,
                            color: rgb(0, 0, 0),
                        });
                    }
                }

                const image = await pdfDoc.embedPng(this.signature);

                page.drawImage(image, {
                    x: this.items.signature.pos.x,
                    y: this.items.signature.pos.y,
                    width: 90,
                    height: 30,
                })
                return pdfDoc;
        });
    }

    public async downloadPdf(doc: PDFDocument) {
        const link = document.createElement('a');
        link.href = await this.getDownloadLink(doc);
        link.download = "vykupni_formular_" + new Date().toISOString().split('T')[0] + ".pdf";
        link.click();
    }

    public async getDownloadLink(doc: PDFDocument): Promise<string> {
        const pdfBytes = await doc.save();
        // Convert the bytes to blob and download it.
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        return window.URL.createObjectURL(blob);
    }
}