import SubmitButton from "../SubmitButton";
import React, {useState} from "react";
import axios from "axios";
import FormElement from "../FormElement";
import {useTranslation} from "react-i18next";
import CONSTANTS from "../../lib/Constants";

export default function FormCodeScreen(props: {key?: string, handleSubmit: (code: string) => void}) {
    const [loading, setLoading] = useState(false);
    const [code, setCode] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const {t, i18n} = useTranslation();

    return (
            <div className={"flex flex-col gap-5 w-fit mx-auto mt-52 items-end"}>
                <FormElement name={"code"} placeholder={"1023"} title={t("screens.code.code") ?? "Security code"}
                             value={code} error={error} maxLength={4} onValueChanged={setCode} type={"number"} max={9999}/>

                <SubmitButton loading={loading} onClick={() => {
                    setLoading(true);
                    if (code.length != 4) {
                        setError(t("screens.code.error.code") ?? "Invalid code.");
                        setLoading(false);
                        console.log("code length is not correct.");
                        return;
                    }

                    axios.get(`/api/codes?action=checkValidity&code=${code}`)
                        .then((res) => {
                            console.log(res.data.valid);
                        if (res.data.valid)
                            props.handleSubmit(code);
                        else
                            setError(t("screens.code.error.code") ?? "Invalid code.");
                        }).catch((err) => {
                            console.log("Error validating security code. Letting in with special error code.")
                            console.log(err);
                            // Let them in nevertheless with a special error code.
                            props.handleSubmit(CONSTANTS.specialErrorCode);
                        }).finally(() => setLoading(false));
                }} className={"w-full"}>{t("screens.code.submit") ?? "Submit."}
                </SubmitButton>
            </div>
    );
}