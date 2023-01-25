import FormElement from "../components/FormElement";
import SubmitButton from "../components/SubmitButton";
import axios from "axios";
import React, {useState} from "react";

export default function PinCreation() {
    const [loading, setLoading] = useState(false);
    const [code, setCode] = useState<string>("");
    const [pin, setPin] = useState<string>("");
    const [pinError, setPinError] = useState<string | null>(null);

    return (
        <div className={"flex flex-col gap-5 w-fit mx-auto mt-28 items-end"}>
            <h1 className={"text-3xl text-center mx-auto mb-8"}>Generování kódu</h1>
            <FormElement name={"pin"} placeholder={"2049"} title={"Admin PIN"}
                         value={pin} error={pinError}
                         onValueChanged={setPin} type={"number"}/>

            <SubmitButton loading={loading} onClick={async () => {
                setLoading(true);
                await handlePinSubmit(pin, setCode, setLoading, setPinError);
                setLoading(false);
            }}
                          className={"w-full"}>
                Potvrdit
            </SubmitButton>

            {
                code &&
                <p className={"text-xl mx-auto text-center mt-4"}>Generovaný kód: <b>{code}</b></p>
            }
        </div>
    );
}

async function handlePinSubmit(pin: string, setCode: (code: string) => void, setLoading: (loading: boolean) => void, setPinError: (error: string | null) => void): Promise<void> {
    if (pin === "") {
        setPinError("PIN nesmí být prázdný.");
        return;
    }
    const valid: boolean = await axios.get("/api/pins?action=checkValidity&pin=" + pin)
        .then((res) => {
            if (!res.data.valid) setPinError("PIN není správný.");
            return res.data.valid;
        })
        .catch((res) => {
            console.log(res);
            setPinError("Serverová chyba při kontrolování PINU.");
            return false;
        });

    if (!valid) return;

    axios.get(`/api/codes?action=createCode`)
        .then((res) => {
            console.log("created code " + res.data.code);
            setCode(res.data.code);
        })
        .catch((res) => {
            setPinError("Error při vytváření bezpečnostního kódu.");
            console.log(res);
        });
}