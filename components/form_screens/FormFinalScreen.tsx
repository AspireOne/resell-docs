import FormNavigationButtons from "../FormButtons";
import {useState} from "react";
import SignatureCanvas from "react-signature-canvas";
import FormElement from "../FormElement";
import {Close, Refresh} from "react-ionicons";
import SubmitButton from "../SubmitButton";

export interface FinalProps {
    date: string;
    signature: string;
}

export default function FormFinalScreen(props: {prevProps?: FinalProps, handleSubmit: (props: FinalProps, forward: boolean) => void}) {
    const [dateError, setDateError] = useState<string | null>(null);
    const [signatureError, setSignatureError] = useState<string | null>(null);

    const [date, setDate] = useState<string>(props.prevProps?.date ?? "");
    const [signature, setSignature] = useState<string>(props.prevProps?.signature ?? "");

    const [customSigDataURL, setCustomSigDataURL] = useState<string | null>(null);
    let sigPadRef: SignatureCanvas | null = null;

    const handleSubmit = (forward: boolean) => {
        const data = {date: date, signature: signature};
        if (!forward) props.handleSubmit(data, forward);

        let error = false;

        if (sigPadRef?.isEmpty && !customSigDataURL) {
            setSignatureError("Musíte podepsat fakturu.");
            error = true;
        } else {
            setSignatureError(null);
        }
        if (!error) {
            props.handleSubmit(data, forward);
        }
    }

    function setCustomSig(dataURL: string | null) {
        setCustomSigDataURL(dataURL);
        if (dataURL) {
            sigPadRef?.clear();
        }
    }

    const signaturePad =
        <SignatureCanvas
            ref={(ref) => { sigPadRef = ref }}
            penColor={customSigDataURL ? "white" : "black"}
            backgroundColor={"white"}
            canvasProps={{
                width: "300px",
                height: "80px",
                className: 'border border-gray-300 rounded ' + (customSigDataURL ? '' : 'cursor-crosshair')}}
        />;
    return (
        <>
            <FormElement name={"date"} type={"date"} placeholder={""} title={"Datum"}
                         value={date} error={dateError} onValueChanged={(val) => {setDateError(null); setDate(val)}}/>

            <div className={"flex flex-row gap-2 items-end"}>
                <FormElement name={"signature"} type={"text"} placeholder={""} title={"Podpis"} error={signatureError} customInputElement={signaturePad}/>
                <Refresh
                    cssClasses={"cursor-pointer"}
                    width={"2rem"}
                    height={"auto"}
                    color={"#442994"}
                    title={"Smazat podpis"}
                    onClick={() => sigPadRef?.clear()}
                />
            </div>

            <div className="flex flex-row gap-2">
                <div className={"flex flex-row gap-1 justify-center items-center"}>
                    <label className="px-3 pb-1 underline custom-file-upload rounded border border-black text-md hover:cursor-pointer">
                        <input
                            type={"file"}
                            accept={"image/png, image/jpeg"}
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;

                                const reader = new FileReader();
                                reader.onload = (e) => {
                                    const dataURL = e.target?.result;
                                    if (typeof dataURL === "string") setCustomSig(dataURL);
                                }
                                reader.readAsDataURL(file);
                            }}
                            className="text-md hidden"
                        />
                        {customSigDataURL ? "Změnit nahraný podpis" : "Nebo nahrajte fotku podpisu"}
                    </label>
                    {customSigDataURL &&
                        <Close
                            onClick={() => setCustomSig(null)}
                            cssClasses={"cursor-pointer"}
                            title={"Smazat nahraný podpis"}
                        />
                    }
                </div>
            </div>

            <FormNavigationButtons handleClick={handleSubmit} secondElement={
                <SubmitButton className={"w-full ml-5"} onClick={handleSubmit}>Uložit a stáhnout PDF</SubmitButton>
            }/>
        </>
    );
}