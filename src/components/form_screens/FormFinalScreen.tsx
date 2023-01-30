import FormNavigationButtons from "../FormButtons";
import {useEffect, useState} from "react";
import SignatureCanvas from "react-signature-canvas";
import FormElement from "../FormElement";
import {Close, Refresh} from "react-ionicons";
import SubmitButton from "../SubmitButton";
import {useTranslation} from "react-i18next";

export interface FinalProps {
    date: string;
    signature: string;
}

export default function FormFinalScreen(props: {prevProps?: FinalProps, handleSubmit: (props: FinalProps, forward: boolean) => void}) {
    const [dateError, setDateError] = useState<string | null>(null);
    const [signatureError, setSignatureError] = useState<string | null>(null);

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
        const data = {date: date, signature: drawnSignature || signatureImg || ""};
        if (!forward) props.handleSubmit(data, forward);

        let error = false;

        if (!drawnSignature && !signatureImg) {
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

            <div className={"flex flex-row gap-2 items-end"}>
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

            <div className={"flex flex-col gap-3"}>
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

            </div>

            {
                // Show the signature image if it's set.
                signatureImg &&
                <div>
                    <img src={signatureImg} height={""} width={"100%"} alt={t("screens.final.hover.uploadedSignature") ?? ""} className={"border border-gray-300 rounded"}/>
                </div>
            }

            <FormNavigationButtons handleClick={handleSubmit} secondElement={
                <SubmitButton className={"w-full ml-5"} onClick={handleSubmit}>{t("screens.final.label.submitButton")}</SubmitButton>
            }/>
        </div>
    );
}