import Head from 'next/head'
import {useState} from "react";
import StepBar from "../components/StepBar";
import FormProductScreen, {ProductProps} from "../components/form_screens/FormProductScreen";
import FormFinalScreen, {FinalProps} from "../components/form_screens/FormFinalScreen";
import FormPersonalInfoScreen, {PersonalInfoProps} from "../components/form_screens/FormPersonalInfoScreen";
import FormIcoScreen from "../components/form_screens/FormIcoScreen";
import FormResultScreen from "../components/form_screens/FormResultScreen";
import DocManipulator from "../backend/DocManipulator";
import axios from "axios";
import {stringify} from "querystring";
import {Data} from "../backend/Data";

const testData: Data = {
    bankAccount: "",
    cin:"27604977",
    city:"Zlín",
    countryCode:"US",
    countryName:"USA",
    currency:"CZK",
    date:"2023-01-20",
    email:"matejpesl1@gmail.com",
    iban:"CZ55 0800 0000 0012 3456 7899",
    nameOrCompany:"Matěj Pešl",
    postalCode:"763 63",
    price:"1999",
    shoeName:"Teniska X-650",
    shoeSize:"23",
    street:"Halenkovice 708",
    signature: ""
}

export default function Home() {
    return (
        <>
            <Head>
                <title>Resell.cz - výkupní faktura</title>
                <meta name="description" content="Nástroj pro vytvoření výkupní faktury u resell.cz." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={"overflow-hidden bg-hero pb-10"}>
                {/*<img src={a1.src} className={"absolute z-[-100]"}/>*/}
                <div className={"text-black text-center m-8"}>
                    <h1 className={"text-3xl font-bold m-1"}>Výkup <span className={""}>Resell</span>.<span className={""}>cz</span></h1>
                    <p className={"text-gray-700 text-lg"}>Vytvoření faktury</p>
                </div>
                <div className={"relative"}>
                    <Form/>
                </div>
            </main>
        </>
    )
}

const Form = () => {
    const [currStep, setCurrStep] = useState<number>(0);

    const [personalInfo, setPersonalInfo] = useState<PersonalInfoProps | undefined>(undefined);
    const [productInfo, setProductInfo] = useState<ProductProps | undefined>(undefined);
    const [finalInfo, setFinalInfo] = useState<FinalProps | undefined>(undefined);
    const [cin, setCin] = useState<boolean>(false);
    
    const [resultState, setResultState] = useState<"loading" | "failed" | "success" | "warning">("loading");
    const [resultMessage, setResultMessage] = useState<string>("");

    const handleScreenSubmit = (forward: boolean) => setCurrStep(currStep + (forward ? 1 : -1));

    const screens = [
        {
            title: "IČO",
            content: <FormIcoScreen handleSubmit={(cin) => {
                setCin(cin);
                handleScreenSubmit(true);
            }}/>
        },
        {
            title: "Osobní údaje",
            content: <FormPersonalInfoScreen prevProps={personalInfo} handleSubmit={(props, forward) => {
                setPersonalInfo(props);
                handleScreenSubmit(forward);
            }}/>
        },
        {
            title: "Produkt",
            content: <FormProductScreen prevProps={productInfo} cin={cin} handleSubmit={(props, forward) => {
                setProductInfo(props);
                handleScreenSubmit(forward);
            }}/>
        },
        {
            title: "Datum a podpis",
            content: <FormFinalScreen prevProps={finalInfo} handleSubmit={async (props, forward) => {
                // Note: THIS DOES NOT UPDATE IMMEDIATELY, THATS WHY WE USE PROPS!
                setFinalInfo(props);
                handleScreenSubmit(forward);
                setResultMessage("Vytváření dokumentu...");
                const data: Data = {...personalInfo!, ...productInfo!, ...props!};
                const docManipulator = new DocManipulator(data);

                let pdf;
                try {
                    pdf = await docManipulator.createPdf();
                    await docManipulator.downloadPdf(pdf);
                } catch (e) {
                    setResultState("failed");
                    setResultMessage("Nastala chyba při vytváření PDF. Vyplňte prosím " +
                        "manuálně tento formulář: " + window.location.host + "/doc.pdf.");
                    return;
                }

                setResultMessage("Ukládání na server...");

                let pdfAsBase64: null | string = null;
                try {
                    pdfAsBase64 = await pdf.saveAsBase64();
                } catch (e) {
                    console.log("Could not convert pdf to base64. " + e);
                }

                try {
                    const expense = await createExpense(data, pdfAsBase64 );
                } catch (e) {
                    setResultState("warning");
                    setResultMessage("Nastala chyba při zaznamenávání faktury na serveru, ale PDF bylo " +
                        "úspěšně staženo. Informujte prosím prodejce.");
                    return;
                }

                setResultState("success");
                setResultMessage("Faktura byla úspěšně vytvořena.");
            }}/>
        },
        {
            title: "Hotovo",
            content: <FormResultScreen state={resultState} message={resultMessage}/>
        }
    ]

    return (
        <>
            <StepBar currStep={currStep} steps={screens.map((screen) => screen.title)}/>
            <form className={"z-1 relative min-h-[600px] pb-28 p-6 rounded w-[32rem] shadow-md border border-gray-200  mx-auto backdrop-blur-lg bg-white bg-opacity-70"}>
                {screens[currStep].content}
            </form>
        </>
    );
}

async function createExpense(data: Data, pdfAsBase64?: string | null): Promise<{[key: string]: string}> {
    // create axios request to http://localhost:3000/api/fakturoid?action=createSubject.
    const subjects: any[] = await axios.get(`http://localhost:3000/api/fakturoid?action=getSubject&email=${data.email}`)
        .then((res) => {
            return res.data;
        }).catch((err) => {
            console.log(err);
            return [];
        });

    let subject: undefined | {[key:string]: string} = subjects[0];

    if (subjects.length === 0) {
        subject = await axios.post("http://localhost:3000/api/fakturoid?action=createSubject", {
            data: {data: data}
        }).then((res) => {
            return res.data;
        }).catch((err) => {
            console.log(err)
            return undefined;
        });
    }

    if (!subject) {
        throw new Error("Could not get or create subject.");
    } else {
        console.log("Got existing subject or created one.");
    }

    return await axios.post("http://localhost:3000/api/fakturoid?action=createExpense", {
        data: {data: data, subjectId: subject.id, pdfEncoded: pdfAsBase64}
    }).then((res) => {
        return res.data;
    });
}