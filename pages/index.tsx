import Head from 'next/head'
import {useState} from "react";
import StepBar from "../components/StepBar";
import FormProductScreen, {ProductProps} from "../components/form_screens/FormProductScreen";
import FormFinalScreen, {FinalProps} from "../components/form_screens/FormFinalScreen";
import FormPersonalInfoScreen, {PersonalInfoProps} from "../components/form_screens/FormPersonalInfoScreen";
import FormCinScreen from "../components/form_screens/FormCinScreen";
import FormResultScreen from "../components/form_screens/FormResultScreen";
import DocManipulator from "../backend/DocManipulator";
import axios from "axios";
    import {stringify} from "querystring";
    import {Data} from "../backend/Data";
    import {useTranslation} from "react-i18next";
    import {Menu} from "@headlessui/react";
    import {Language} from "react-ionicons";
    import {PL, US, CZ, DE} from "country-flag-icons/react/3x2";
import LanguageDropdown from "../components/LanguageDropdown";

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
    const {t, i18n} = useTranslation();

    return (
        <>
            <Head>
                <title>{t("head.title")}</title>
                <meta name="description" content={t("head.description") ?? ""} />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={"overflow-hidden bg-hero pb-10"}>
                <LanguageDropdown/>

                <div className={"text-black text-center m-8"}>
                    <h1 className={"text-3xl font-bold m-1"}>{t("main.title")}</h1>
                    <p className={"text-gray-700 text-lg"}>{t("main.description")}</p>
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

    const {t, i18n} = useTranslation();

    const handleScreenSubmit = (forward: boolean) => setCurrStep(currStep + (forward ? 1 : -1));

    const screens = [
        {
            title: t("screens.cin.name"),
            content: <FormCinScreen handleSubmit={(cin) => {
                setCin(cin);
                handleScreenSubmit(true);
            }}/>
        },
        {
            title: t("screens.personalInfo.name"),
            content: <FormPersonalInfoScreen prevProps={personalInfo} handleSubmit={(props, forward) => {
                setPersonalInfo(props);
                handleScreenSubmit(forward);
            }}/>
        },
        {
            title: t("screens.product.name"),
            content: <FormProductScreen prevProps={productInfo} cin={cin} handleSubmit={(props, forward) => {
                setProductInfo(props);
                handleScreenSubmit(forward);
            }}/>
        },
        {
            title: t("screens.final.name"),
            content: <FormFinalScreen prevProps={finalInfo} handleSubmit={async (props, forward) => {
                // Note: THIS DOES NOT UPDATE IMMEDIATELY, THATS WHY WE USE PROPS!
                setFinalInfo(props);
                handleScreenSubmit(forward);
                if (!forward) return;
                setResultMessage(t("screens.result.progressMsg") ?? "");
                const data: Data = {...personalInfo!, ...productInfo!, ...props!};
                const docManipulator = new DocManipulator(data);

                let pdf;
                try {
                    pdf = await docManipulator.createPdf();
                    await docManipulator.downloadPdf(pdf);
                } catch (e) {
                    setResultState("failed");
                    setResultMessage(t("screens.result.failedMsg", {url: window.location.host + "/doc.pdf"}) ?? "");
                    return;
                }

                setResultMessage(t("screens.result.savingToServerMsg") ?? "");

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
                    setResultMessage(t("screens.result.warningMsg") ?? "");
                    return;
                }

                setResultState("success");
                setResultMessage(t("screens.result.successMsg") ?? "");
            }}/>
        },
        {
            title: t("screens.result.name"),
            content: <FormResultScreen state={resultState} message={resultMessage}/>
        }
    ]

    return (
        <>
            <StepBar currStep={currStep} steps={screens.map((screen) => screen.title)}/>
            <form className={"z-1 relative min-h-[600px] pb-28 p-6 rounded w-full sm:w-[32rem] shadow-md border border-gray-200  mx-auto backdrop-blur-lg bg-white bg-opacity-70"}>
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