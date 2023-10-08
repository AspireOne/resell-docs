import {PDFDocument, rgb} from "pdf-lib";
import axios from "axios";
import fontkit from "@pdf-lib/fontkit";
import {Data} from "./Data";

export default class PdfManipulator {
  private readonly items: { [key: string]: { text: string, pos: { x: number, y: number } } }
  private readonly signature: string;

  constructor(docProps: Data) {
    if (!docProps.signature) throw new Error("Tried to createpdf without signature provided.");

    this.signature = docProps.signature;
    this.items = {
      name: {
        text: docProps.nameOrCompany,
        pos: {x: 320, y: 495}
      },
      address1: {
        text: `${docProps.street}`,
        pos: {x: 320, y: 462}
      },
      address2: {
        text: `${docProps.postalCode} ${docProps.city}`,
        pos: {x: 320, y: 445}
      },
      address3: {
        text: `${docProps.countryName}`,
        pos: {x: 320, y: 429}
      },
      email: {
        text: docProps.email,
        pos: {x: 320, y: 400}
      },
      productName: {
        text: `${docProps.shoeName} (velikost ${docProps.shoeSize})`,
        pos: {x: 75, y: 335}
      },
      productPrice: {
        text: `${docProps.price} ${docProps.currency}`,
        pos: {x: 450, y: 335}
      },
      bankAccount: {
        text: docProps.bankAccount || docProps.iban!,
        pos: {x: 156, y: 206}
      },
      date: {
        text: docProps.date,
        pos: {x: 71, y: 147}
      },
      signature: {
        text: "",
        pos: {x: 400, y: 148}
      },
    }
  }

  public async createPdf(): Promise<PDFDocument> {
    return axios.get('/invoice.pdf', {responseType: 'arraybuffer'})
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