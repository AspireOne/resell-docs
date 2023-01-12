import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import {PropsWithChildren, useState} from "react";

export default function Home() {
    const [page, setPage] = useState<"ico-selection" | "form">("ico-selection");
    const [ico, setIco] = useState(false);

    function setIcoAndProgress(hasIco: boolean) {
        setIco(hasIco);
        setPage("form");
    }

    // TODO: Make a visual transition between the two pages (1/2 steps etc.)
    return (
        <>
            <Head>
                <title>Resell.cz - výkupní faktura</title>
                <meta name="description" content="Nástroj pro vytvoření výkupní faktury u resell.cz." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={"bg-gray-100"}>
                <h1>Výkup resell.cz</h1>
                <div className={"rounded w-[30rem] shadow-md mx-auto"}>
                    <div className={"relative"}>
                        <div>
                            {page === "ico-selection" && <IcoSelection handleIcoSet={setIcoAndProgress} />}
                            {page === "form" && <Form hasIco={ico} />}
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

// TODO: Make it steps-based.
//  1. IČO (yes/no),
//  2. personal information,
//  3. the product - name of shoes, price, currency, bank account
//  4. final - date, signature, save & download button.
//  5. Success page - Send it to Facturoid etc. and download it as PDF.
//
// It will not let you to the next step if any information is wrong.
const Form = ({hasIco}: {hasIco: boolean}) => {
    return (
        <form className={"flex flex-col gap-3 p-6"}>
            <FormElement name={"name"} type={"name"} placeholder={"Jan Novák"} title={"Název / Jméno a Příjmení"}/>
            <FormElement name={"email"} type={"email"} placeholder={"jmeno@spolecnost.cz"} title={"E-mail"}/>
            <FormElement name={"ICO"} type={"text"} placeholder={"IČ 12345678"} title={"IČO"}/>
            <FormElement name={"country"} type={"text"} placeholder={"Česká Republika"} title={"Země"}/>

            <div className="flex flex-row gap-2 justify-center">
                <FormElement name={"city"} type={"text"} placeholder={"Praha"} title={"Město"}/>
                <FormElement name={"PSC"} type={"text"} placeholder={"763 63"} title={"PSČ"}/>
            </div>

            <FormElement name={"street"} type={"text"} placeholder={"Dlouhá 763"} title={"Ulice"}/>

            <div className="flex flex-row gap-2 justify-center">
                <FormElement name={"date"} type={"date"} placeholder={""} title={"Datum"}/>
                {/*TODO: Make this a field that allows for a hand-written signature.*/}
                <FormElement name={"signature"} type={"text"} placeholder={"NameName"} title={"Podpis"}/>
            </div>

            {/*// TODO: Visually make new section.*/}

            <div className="flex flex-row gap-2 justify-center">
                {/*TODO: Make the size smaller or make it both only one field.*/}
                <FormElement name={"shoe_name"} type={"text"} placeholder={"ADIDAS I-5923"} title={"Název bot"}/>
                <FormElement name={"shoe_size"} type={"text"} placeholder={"45"} title={"Velikost"}/>
            </div>

            <button
                className="mx-12 hover:shadow-form rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none"
            >
                Uložit a stáhnout PDF
            </button>
        </form>
    )
}

const FormIcoScreen = () => {

}

const FormPersonalInfoScreen = () => {

}

const FormProductScreen = () => {

}

const FormFinalScreen = () => {

}

// Success / failed.
const FormResultScreen = () => {

}

const FormElement = (props: {name: string, type?: string, placeholder: string, title: string, className?: string}) => {
    return (
        <div>
            <label
                htmlFor={props.name}
                className="mb-3 block text-base font-medium text-[#07074D]"
            >
                {props.title}
            </label>
            <input
                type={props.type ?? "text"}
                name={props.name}
                placeholder={props.placeholder}
                className={"w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-4 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md " + (props.className ?? "")}
            />
        </div>
    );
}

const IcoSelection = (props: {handleIcoSet: (hasIco: boolean) => void}) => {
    return (
        <div className={"flex flex-row gap-5 w-fit mx-auto m-64"}>
            <button onClick={() => props.handleIcoSet(true)} className={"p-2 px-4 rounded border border-gray-500 w-40"}>Mám IČO</button>
            <button onClick={() => props.handleIcoSet(false)} className={"p-2 px-4 rounded border border-gray-500 w-40"}>Nemám IČO</button>
        </div>
    );
}

/*
const Button = (props: PropsWithChildren<{) => {
    return (
        <button className={"text-red-500"}>{props.children}</button>
    );
}*/
