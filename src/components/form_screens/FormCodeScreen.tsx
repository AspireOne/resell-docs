import Button from "../Button";
import React, {useEffect, useState} from "react";
import FormElement from "../FormElement";
import {useTranslation} from "react-i18next";
import {trpc} from "../../lib/trpc";

export default function FormCodeScreen(props: {key?: string, handleSubmit: (code: number) => void}) {
    const [code, setCode] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const {t, i18n} = useTranslation();

    // if code is in query params, set it.
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        if (code) codeValidationMutation.mutate({code: Number(code)});
    }, []);

    const codeValidationMutation = trpc.codes.isCodeValid.useMutation({
        onSuccess: (data) => {
            if (data.valid)
                props.handleSubmit(Number(code));
            else
                setError(t("screens.code.error.code") ?? "Invalid code.");
        },
        onError: (error) => {
            setError(`${t("server.error")} (${error.message})`);
        }
    });

    return (
            <div className={"flex flex-col gap-5 w-fit mx-auto mt-52 items-end"}>
                <FormElement name={"code"} placeholder={"1023"} title={t("screens.code.code") ?? "Security code"}
                             value={code} error={error} type={"number"} max={1000000000}
                             onValueChanged={(val) => {
                                 setCode(val);
                                 setError(null);
                             }}/>

                <Button loading={codeValidationMutation.isLoading} onClick={async () => {
                    if (code.length != 4) {
                        setError(t("screens.code.error.code") ?? "Invalid code.");
                        return;
                    }

                    codeValidationMutation.mutate({code: Number(code)});
                }} className={"w-full"}>{t("screens.code.submit") ?? "Submit."}
                </Button>
            </div>
    );
}