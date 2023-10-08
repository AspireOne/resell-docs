import {Button} from "react-daisyui";
import PdfManipulator from "../lib/PdfManipulator";
import {Data} from "../lib/Data";
import {useEffect, useState} from "react";

const testData: Data = {
  bankAccount: "bank account",
  cin:"CIN",
  city:"City",
  countryCode:"Country Code",
  countryName:"Country Name",
  currency:"Currency",
  date:"2022-02-22",
  email:"email@gmail.com",
  iban:"IBAN IBAN IBAN IBAN IBAN IBAN",
  nameOrCompany: "Name or company",
  postalCode:"Postal Code",
  price:"Price",
  shoeName:"Shoe Name",
  shoeSize:"Shoe Size",
  street:"Street Address",
  signature: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAADICAYAAABS39xVAAACBklEQVR42u3UMQ0AAAgEsUc50kEFA0kr4YarZDoAD5RhAYYFYFiAYQEYFoBhAYYFYFgAhgUYFoBhARgWYFgAhgVgWIBhARgWgGEBhgVgWACGBRgWgGEBGBZgWACGBWBYgGEBGBZgWIYFGBaAYQGGBWBYAIYFGBaAYQEYFmBYAIYFYFiAYQEYFoBhAYYFYFgAhgUYFoBhARgWYFgAhgVgWIBhARgWgGEBhgVgWIBhGRZgWACGBRgWgGEBGBZgWACGBWBYgGEBGBaAYQGGBWBYAIYFGBaAYQEYFmBYAIYFYFiAYQEYFoBhAYYFYFgAhgUYFoBhAYZlWIBhARgWYFgAhgVgWIBhARgWgGEBhgVgWACGBRgWgGEBGBZgWACGBWBYgGEBGBaAYQGGBWBYAIYFGBaAYQEYFmBYAIYFGJYMgGEBGBZgWACGBWBYgGEBGBaAYQGGBWBYAIYFGBaAYQEYFmBYAIYFYFiAYQEYFoBhAYYFYFgAhgUYFoBhARgWYFgAhgUYFoBhARgWYFgAhgVgWIBhARgWgGEBhgVgWACGBRgWgGEBGBZgWACGBWBYgGEBGBaAYQGGBWBYAIYFGBaAYQEYFmBYAIYFGBaAYQEYFmBYAIYFYFiAYQEYFoBhAYYFYFgAhgUYFoBhARgWYFgAhgVgWIBhARgWgGEBhgVgWACGBRgWwJ0FoJcrSK1yLqsAAAAASUVORK5CYII=",
  customInvoice: undefined
}

export default function FormTest() {
  const [pdf, setPdf] = useState<string | null>(null);

  useEffect(() => {
    async function run() {
      const pdfManipulator = new PdfManipulator(testData);

      try {
        const pdf = await pdfManipulator.createPdf();
        setPdf(await pdf.saveAsBase64({dataUri: true}));
      } catch (e) {
        console.error(e)
      }
    }
    run();
  }, []);

  return (
    <div className={"h-screen"}>
      {!pdf && <p>Loading...</p>}
      {pdf && <iframe src={pdf} height="100%" width="100%"></iframe>}
    </div>
  )
}