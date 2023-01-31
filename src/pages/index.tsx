import Head from 'next/head'
import {useState} from "react";
import StepBar from "../components/StepBar";
import FormProductScreen, {ProductProps} from "../components/form_screens/FormProductScreen";
import FormFinalScreen, {FinalProps} from "../components/form_screens/FormFinalScreen";
import FormPersonalInfoScreen, {PersonalInfoProps} from "../components/form_screens/FormPersonalInfoScreen";
import FormCinScreen from "../components/form_screens/FormCinScreen";
import FormResultScreen from "../components/form_screens/FormResultScreen";
import PdfManipulator from "../lib/PdfManipulator";
import axios from "axios";
import {Data} from "../lib/Data";
    import {useTranslation} from "react-i18next";
import LanguageDropdown from "../components/LanguageDropdown";
import FormCodeScreen from "../components/form_screens/FormCodeScreen";
import {trpc} from "../lib/trpc";
import {PDFDocument} from "pdf-lib";

const testData: Data = {
    bankAccount: "",
    cin:"",
    city:"Zlin",
    countryCode:"CZ",
    countryName:"Czech Republic",
    currency:"CZK",
    date:"2023-01-25",
    email:"matejpesl1@gmail.com",
    iban:"CZ55 0800 0000 0012 3456 7899",
    nameOrCompany:"Matěj Pešl",
    postalCode:"76363",
    price:"1",
    shoeName:"Teniska X-H50",
    shoeSize:"24",
    street:"Halenkovice 706",
    signature: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAakAAABaCAYAAAACXalYAAAAAXNSR0IArs4c6QAAA7xJREFUeF7t2bGNg1AURNHvApxQLolNRCU0QYJEY6yWAhyiGxwyIkbnjTQBr+u6ruEhQIAAAQJBgZeRCl5FJAIECBC4BYyUIhAgQIBAVsBIZU8jGAECBAj8HKlt28a6rrfSeZ5jmiZiBAgQIEDgMYGfI/X9fseyLHeYz+cz/t89BAgQIEDgKYGfI7Xv+5jnebzf73Ecx1OZfIcAAQIECNwC/kkpAgECBAhkBYxU9jSCESBAgICR0gECBAgQyAoYqexpBCNAgAABI6UDBAgQIJAVMFLZ0whGgAABAkZKBwgQIEAgK2CksqcRjAABAgSMlA4QIECAQFbASGVPIxgBAgQIGCkdIECAAIGsgJHKnkYwAgQIEDBSOkCAAAECWQEjlT2NYAQIECBgpHSAAAECBLICRip7GsEIECBAwEjpAAECBAhkBYxU9jSCESBAgICR0gECBAgQyAoYqexpBCNAgAABI6UDBAgQIJAVMFLZ0whGgAABAkZKBwgQIEAgK2CksqcRjAABAgSMlA4QIECAQFbASGVPIxgBAgQIGCkdIECAAIGsgJHKnkYwAgQIEDBSOkCAAAECWQEjlT2NYAQIECBgpHSAAAECBLICRip7GsEIECBAwEjpAAECBAhkBYxU9jSCESBAgICR0gECBAgQyAoYqexpBCNAgAABI6UDBAgQIJAVMFLZ0whGgAABAkZKBwgQIEAgK2CksqcRjAABAgSMlA4QIECAQFbASGVPIxgBAgQIGCkdIECAAIGsgJHKnkYwAgQIEDBSOkCAAAECWQEjlT2NYAQIECBgpHSAAAECBLICRip7GsEIECBAwEjpAAECBAhkBYxU9jSCESBAgICR0gECBAgQyAoYqexpBCNAgAABI6UDBAgQIJAVMFLZ0whGgAABAkZKBwgQIEAgK2CksqcRjAABAgSMlA4QIECAQFbASGVPIxgBAgQIGCkdIECAAIGsgJHKnkYwAgQIEDBSOkCAAAECWQEjlT2NYAQIECBgpHSAAAECBLICRip7GsEIECBAwEjpAAECBAhkBYxU9jSCESBAgICR0gECBAgQyAoYqexpBCNAgAABI6UDBAgQIJAVMFLZ0whGgAABAkZKBwgQIEAgK2CksqcRjAABAgSMlA4QIECAQFbASGVPIxgBAgQIGCkdIECAAIGsgJHKnkYwAgQIEDBSOkCAAAECWQEjlT2NYAQIECBgpHSAAAECBLICRip7GsEIECBAwEjpAAECBAhkBYxU9jSCESBAgICR0gECBAgQyAr8ASBReQLHEXiIAAAAAElFTkSuQmCC",
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
    const [code, setCode] = useState<number | null>(null);
    const {t} = useTranslation();

    const [personalInfo, setPersonalInfo] = useState<PersonalInfoProps | undefined>(undefined);
    const [productInfo, setProductInfo] = useState<ProductProps | undefined>(undefined);
    const [finalInfo, setFinalInfo] = useState<FinalProps | undefined>(undefined);
    const [cin, setCin] = useState<boolean>(false);
    
    const [resultState, setResultState] = useState<"loading" | "failed" | "success" | "warning">("loading");
    const [resultDownloadLoading, setResultDownloadLoading] = useState<boolean>(true);
    const [resultDownloadLink, setResultDownloadLink] = useState<string | null>(null);
    const [resultMessage, setProgressMessage] = useState<string>("");

    const expenseMutation = trpc.fakturoid.createExpense.useMutation();

    const changeScreen = (forward: boolean) => setCurrStep(currStep + (forward ? 1 : -1));

    const screens = [
        {
            title: t("screens.code.name"),
            content: <FormCodeScreen handleSubmit={(code) => {
                setCode(code);
                changeScreen(true);
            }}/>
        },
        {
            title: t("screens.cin.name"),
            content: <FormCinScreen handleSubmit={(cin) => {
                setCin(cin);
                changeScreen(true);
            }}/>
        },
        {
            title: t("screens.personalInfo.name"),
            content: <FormPersonalInfoScreen prevProps={personalInfo} handleSubmit={(props, forward) => {
                setPersonalInfo(props);
                changeScreen(forward);
            }}/>
        },
        {
            title: t("screens.product.name"),
            content: <FormProductScreen prevProps={productInfo} cin={cin} handleSubmit={(props, forward) => {
                setProductInfo(props);
                changeScreen(forward);
            }}/>
        },
        {
            title: t("screens.final.name"),
            content: <FormFinalScreen prevProps={finalInfo} handleSubmit={async (props, forward) => {
                setFinalInfo(props);
                changeScreen(forward);
                if (!forward) return;

                function finish(state: "loading" | "failed" | "success" | "warning", message: string) {
                    setResultDownloadLoading(false);
                    setProgressMessage(message);
                    setResultState(state);
                }

                setProgressMessage(t("screens.result.creatingPdfMsg") ?? "");

                // PDF.
                const data: Data = {...personalInfo!, ...productInfo!, ...props!};
                const pdfManipulator = new PdfManipulator(data);
                let pdfAsBase64: string;
                try {
                    const pdf = await pdfManipulator.createPdf();
                    pdfAsBase64 = await pdf.saveAsBase64({dataUri: true});
                    setResultDownloadLink(pdfAsBase64);
                } catch (e) {
                    setResultDownloadLink(window.location.host + "/invoice.pdf");
                    finish("failed", t("screens.result.failureMsg") ?? "");
                    return;
                }

                setProgressMessage(t("screens.result.savingToServerMsg") ?? "");

                // Fakturoid expense.
                try {
                    const expense = await expenseMutation.mutateAsync({code: code!, data: data, pdfEncoded: pdfAsBase64});
                } catch (e: any) {
                    finish("warning", `${t("screens.result.warningMsg")} (${t("server.error")} "${e.message}")`);
                    return;
                }

                finish("success", t("screens.result.successMsg") ?? "");
            }}/>
        },
        {
            title: t("screens.result.name"),
            content: <FormResultScreen downloadLoading={resultDownloadLoading} state={resultState} message={resultMessage} downloadLink={resultDownloadLink}/>
        }
    ]

    return (
        <>
            <StepBar currStep={currStep} steps={screens.map((screen) => screen.title)}/>
            <form className={"z-1 relative min-h-[600px] pb-28 p-6 rounded w-full sm:w-[32rem] shadow-md border border-gray-200  mx-auto backdrop-blur-lg bg-white bg-opacity-70"}>
                {screens[currStep].content}
            </form>
{/*            <button onClick={async () => {
                const pdf = await new DocManipulator(testData).createPdf();
                await createExpense(testData, await pdf.saveAsBase64({dataUri: true}));
            }}>I LOVE TITTY GIRLS</button>*/}
        </>
    );
}