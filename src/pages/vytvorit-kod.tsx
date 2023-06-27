import FormElement from "../components/FormElement";
import Button from "../components/Button";
import axios from "axios";
import React, {useEffect, useState} from "react";
import {trpc} from "../lib/trpc";
import {useTranslation} from "react-i18next";

export default function PinCreation() {
    const [code, setCode] = useState<number | null>(null);
    const [pin, setPin] = useState<string>("");
    const [pinError, setPinError] = useState<string | null>(null);
    const {t} = useTranslation();
    const [directLinkCopied, setDirectLinkCopied] = useState<boolean>(false);

    const [allCodes, setAllCodes] = useState<{code: number, createdAt: string}[] | null>(null);

    const codeCreationMutation = trpc.codes.createCode.useMutation({
        onSuccess: (data) => {
            setCode(data.code);
            if (!allCodes)
                allCodesMutation.mutate({pin: Number(pin)});
            else
                setAllCodes([{code: data.code, createdAt: new Date().toISOString()}, ...allCodes]);
        },
        onError: (error) => {
            setPinError(`${t("server.error")} (${error.message})`);
        }
    });

    const allCodesMutation = trpc.codes.getAllCodes.useMutation({
        onSuccess: (data) => {
            const codesSortedByDate = data.codes.sort((a, b) => {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });
            setAllCodes(codesSortedByDate);
        }
    });

    return (
        <>
            <div className={"max-w-full px-4 sm:px-0 sm:max-w-xs mx-auto mt-28"}>
                <h1 className={"text-3xl text-center mx-auto mb-8"}>Generování kódu</h1>
                <FormElement name={"pin"} placeholder={"2049"} title={"Admin PIN"}
                             value={pin} error={pinError} type={"number"} className={""}
                             onValueChanged={(val) => {
                                 setPin(val);
                                 setPinError(null);
                             }}/>

                <Button loading={codeCreationMutation.isLoading} onClick={async () => {
                    setPinError(null);
                    if (!pin) {
                        setPinError("PIN nesmí být prázdný.");
                        return;
                    }
                    codeCreationMutation.mutate({pin: Number(pin)});
                }} className={"w-full mt-4"}>
                    Vygenerovat
                </Button>

                {
                    code &&
                    <p className={"text-xl mx-auto text-center my-8"}>
                        Generovaný kód: <b>{code}</b>
                        <button
                            className={"mt-2 text-base " + (directLinkCopied ? "text-green-500" : "underline")}
                            disabled={directLinkCopied}
                            onClick={() => {
                                navigator.clipboard.writeText(`${window.location.origin}/?code=${code}`);
                                setDirectLinkCopied(true);
                                setTimeout(() => setDirectLinkCopied(false), 1000);
                        }}>
                            {directLinkCopied ? "Odkaz zkopírován" : "Zkopírovat přímý odkaz"}
                        </button>
                    </p>
                }

                {
                    allCodes &&
                    <div className={"mx-auto rounded-lg border bg-gray-100 shadow-xl py-4"}>
                        <p className={"text-xl text-center mb-2"}>Aktivní kódy:</p>
                        <div className={"flex flex-row flex-wrap items-center justify-center"}>
                            {
                                allCodes.map((code, index) => {
                                    // format the created at date to MM.DD HH:MM:SS
                                    const createdAtFormatted = new Date(code.createdAt).toLocaleString("cs-CZ", {
                                        month: "numeric", day: "2-digit", hour: "2-digit", minute: "2-digit"
                                    });

                                    return (
                                        <div key={index} className={"p-4"}>
                                            <p className={"text-xl text-center"}>{code.code}</p>
                                            <p className={"text-sm"}>{createdAtFormatted}</p>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                }
            </div>
        </>
    );
}