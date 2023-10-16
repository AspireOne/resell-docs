import Head from 'next/head'
import {useEffect, useState} from "react";
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
            content: <FormPersonalInfoScreen hasCin={cin} prevProps={personalInfo} handleSubmit={(props, forward) => {
                setPersonalInfo(props);
                changeScreen(forward);
            }}/>
        },
        {
            title: t("screens.product.name"),
            content: <FormProductScreen countryCode={personalInfo?.countryCode ?? "CZ"} prevProps={productInfo} cin={cin} handleSubmit={(props, forward) => {
                setProductInfo(props);
                changeScreen(forward);
            }}/>
        },
        {
            title: t("screens.final.name"),
            content: <FormFinalScreen hasCin={cin} prevProps={finalInfo} handleSubmit={async (props, forward) => {
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
                let pdfAsBase64: string;

                if (!data.customInvoice) {
                    const pdfManipulator = new PdfManipulator(data);
                    try {
                        const pdf = await pdfManipulator.createPdf();
                        pdfAsBase64 = await pdf.saveAsBase64({dataUri: true});
                        setResultDownloadLink(pdfAsBase64);
                    } catch (e) {
                        setResultDownloadLink(window.location.host + "/invoice.pdf");
                        finish("failed", t("screens.result.failureMsg") ?? "");
                        return;
                    }
                } else {
                    setResultDownloadLink(null);
                    pdfAsBase64 = data.customInvoice;
                    console.log("uploaded pdf as base64", pdfAsBase64);
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
            <form className={"z-1 relative min-h-[600px] pb-28 p-6 rounded-lg w-full sm:w-[32rem] mx-auto backdrop-blur-lg bg-white bg-opacity-70 sm:shadow-md sm:border sm:border-gray-200"}>
                {screens[currStep].content}
            </form>
{/*            <button onClick={async () => {
                const pdf = await new DocManipulator(testData).createPdf();
                await createExpense(testData, await pdf.saveAsBase64({dataUri: true}));
            }}>I LOVE TITTY GIRLS</button>*/}
        </>
    );
}