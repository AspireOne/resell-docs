import FormNavigationButtons from "../FormButtons";
import {useEffect, useState} from "react";
import SignatureCanvas from "react-signature-canvas";
import FormElement from "../FormElement";
import {Refresh, TrashOutline} from "react-ionicons";
import Button from "../Button";
import {useTranslation} from "react-i18next";
import {t} from "i18next";

interface BaseFinalProps {
    date: string;
    signature: string | undefined;
    customInvoice: string | undefined;
}
export type FinalProps = Required<Pick<BaseFinalProps, 'signature' | 'customInvoice'>> & Omit<BaseFinalProps, 'signature' | 'customInvoice'>;

export default function FormFinalScreen(props: {prevProps?: FinalProps, handleSubmit: (props: FinalProps, forward: boolean) => void, hasCin: boolean}) {
    const [dateError, setDateError] = useState<string | null>(null);
    const [signatureError, setSignatureError] = useState<string | null>(null);

    const [customInvoice, setcustomInvoice] = useState<string | null>(null);
    const [date, setDate] = useState<string>(props.prevProps?.date ?? new Date().toISOString().split("T")[0]);
    // Intentionally not setting it from prevProps because of conflict with signature img.
    const [drawnSignature, setDrawnSignature] = useState<string>("");
    const [signatureImg, setSignatureImg] = useState<string | null>(null);
    let sigPad: SignatureCanvas | null = null;

    const {t} = useTranslation();
    /*const canvas = (sigPad?.getCanvas() as HTMLCanvasElement);*/

    // When signature image is set or reset, reset drawn signature.
    useEffect(() => {
        if (signatureImg) {
            setSignatureError(null);
            sigPad?.clear();
            setDrawnSignature("");
        }
    }, [signatureImg]);

    useEffect(() => {
        if (drawnSignature) setSignatureError(null);
    }, [drawnSignature]);

    const handleSubmit = (forward: boolean) => {
        const data: FinalProps = {
            date: date,
            signature: drawnSignature || signatureImg || "",
            customInvoice: customInvoice ?? undefined};

        if (!forward) props.handleSubmit(data, forward);

        let error = false;

        if (!drawnSignature && !signatureImg && !props.hasCin) {
            setSignatureError(t("screens.final.error.signature"));
            error = true;
        } else {
            setSignatureError(null);
        }

        if (!date) {
            setDateError(t("screens.final.error.date"));
            error = true;
        } else {
            setDateError(null);
        }

        if (!error) {
            props.handleSubmit(data, forward);
        }
    }

    const signaturePad =
        <SignatureCanvas
            ref={(ref) => { sigPad = ref }}
            penColor={signatureImg ? "white" : "black"}
            backgroundColor={"white"}
            onEnd={e => {
                if (signatureImg) return;
                setDrawnSignature(sigPad?.toDataURL() ?? "");
            }}
            canvasProps={{
                width: "425px",
                height: "120px",
                className: `w-full h-[120px] border border-gray-300 rounded ${!signatureImg && "cursor-crosshair"}`}}
        />;
    return (
        <div className={"flex flex-col gap-3"}>
            <FormElement name={"date"} type={"date"} placeholder={""} title={t("screens.final.label.date") ?? ""}
                         value={date} error={dateError} onValueChanged={(val) => {setDateError(null); setDate(val)}}/>

            <div className={"flex flex-row gap-2 items-end " + (props.hasCin && "hidden")}>
                <FormElement name={"signature"} type={"text"} placeholder={""} title={t("screens.final.label.signature") ?? ""} error={signatureError} customInputElement={signaturePad}/>
                <Refresh
                    cssClasses={signatureImg ? "" : "cursor-pointer"}
                    width={"2rem"}
                    height={"auto"}
                    color={"#442994"}
                    title={t("screens.final.hover.deleteSignature")}
                    onClick={() => {
                        if (signatureImg) return;
                        sigPad?.clear();
                        setDrawnSignature("");
                    }}
                />
            </div>

            <PdfDropzone hidden={!props.hasCin} onChange={(pdf) => {
                // Convert file to base64 string.
                if (!pdf) {
                    console.log("uploaded pdf:", pdf);
                    setcustomInvoice(null);
                    return;
                }
                const reader = new FileReader();
                reader.onload = (e) => {
                    const dataURL = e.target?.result;
                    console.log(dataURL);
                    if (typeof dataURL === "string") setcustomInvoice(dataURL);
                    else {
                        console.error("Error converting pdf to base64 string. Reader returned byte array instead of string.");
                        setcustomInvoice(null);
                    }
                }
                reader.readAsDataURL(pdf);
            }}/>

            <p className={"mt-3 whitespace-pre-line text-sm text-gray-500"}>
                {t("screens.final.label.notice")}
            </p>

            <FormNavigationButtons handleClick={handleSubmit} secondElement={
                <Button disabled={props.hasCin && !customInvoice} className={"w-full ml-5"} onClick={handleSubmit}>
                    {props.hasCin
                        ? t("screens.final.label.submitButtonCin")
                        : t("screens.final.label.submitButton")}
                </Button>
            }/>
        </div>
    );
}

function PdfDropzone(props: {onChange: (file: File | null) => void, hidden: boolean}) {
    const [uploadedPdf, setUploadedPdf] = useState<File | null>(null);

    useEffect(() => {
        props.onChange(uploadedPdf);
    }, [props, uploadedPdf]);

    return (
        <div className={"flex-col w-full " + (props.hidden && "hidden ") + (!!uploadedPdf && "cursor-not-allowed")}>
            <div className={"flex flex-col"}>
                <label htmlFor="dropzone-file"
                       className={"flex flex-col items-center justify-center w-full h-44 border-2 border-gray-300 border-dashed rounded-lg bg-gray-50 " + (!uploadedPdf && "hover:bg-gray-100 cursor-pointer")}>
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor"
                             viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                        </svg>
                        <p className="mb-2 p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">
                            {t("screens.final.label.uploadInvoice")} {/*Nahrajte fakturu pomocí kliknutí, nebo přetažením sem.*/}
                            </span>
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">

                        </p>
                    </div>
                    <input id="dropzone-file" type="file" disabled={!!uploadedPdf} className="hidden" accept="application/pdf"
                           onChange={(e) => {
                               const file = e.target.files?.[0];
                               if (!file) return;
                               setUploadedPdf(file);
                           }}
                    />
                </label>
            </div>

            {uploadedPdf && (
                <div className="mt-3 border border-gray-300 hover:bg-gray-100/40 border-1 p-2 rounded-lg flex justify-between flex-row gap-4 items-center w-full">
                    <p className="text-center text-gray-600">
                        {uploadedPdf.name}
                    </p>
                    <div className={"p-2 rounded-lg border hover:bg-gray-200"} onClick={() => setUploadedPdf(null)}>
                        <TrashOutline color={"red"}/>
                    </div>
                </div>
                )}
        </div>
    )
}


/*<div className={"flex flex-col gap-3"}>
    <div className={"flex flex-row gap-1"}>
                    <label className="pr-3 pb-1 underline custom-file-upload rounded text-md hover:cursor-pointer">
                        <input
                            type={"file"}
                            accept={"image/png, image/jpeg"}
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;

                                const reader = new FileReader();
                                reader.onload = (e) => {
                                    const dataURL = e.target?.result;
                                    if (typeof dataURL === "string") setSignatureImg(dataURL);
                                }
                                reader.readAsDataURL(file);
                            }}
                            className="text-md hidden"
                        />
                        {signatureImg ? t("screens.final.label.changeUploadedSignature") : t("screens.final.label.uploadSignature")}
                    </label>
                    {signatureImg &&
                        <Close
                            onClick={() => setSignatureImg(null)}
                            cssClasses={"cursor-pointer"}
                            title={t("screens.final.label.removeUploadedSignature")}
                        />
                    }
                </div>

</div>*/
/*
{
    // Show the signature image if it's set.
    signatureImg &&
    <div>
        <img src={signatureImg} height={""} width={"100%"} alt={t("screens.final.hover.uploadedSignature") ?? ""} className={"border border-gray-300 rounded"}/>
    </div>
}*/
