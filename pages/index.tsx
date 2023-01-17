import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import {ChangeEvent, PropsWithChildren, ReactNode, useRef, useState} from "react";
import SignatureCanvas from 'react-signature-canvas';
import {Checkmark, Close, Refresh, CheckmarkCircle, CheckmarkDone} from 'react-ionicons'
import {twMerge} from "tailwind-merge";
import StepBar from "../components/StepBar";
import FormElement from "../components/FormElement";
import FormProductScreen, {ProductProps} from "../components/form_screens/FormProductScreen";
import FormFinalScreen, {FinalProps} from "../components/form_screens/FormFinalScreen";
import FormPersonalInfoScreen, {PersonalInfoProps} from "../components/form_screens/FormPersonalInfoScreen";
import FormIcoScreen from "../components/form_screens/FormIcoScreen";
import FormResultScreen from "../components/form_screens/FormResultScreen";


export default function Home() {
    return (
        <>
            <Head>
                <title>Resell.cz - výkupní faktura</title>
                <meta name="description" content="Nástroj pro vytvoření výkupní faktury u resell.cz." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={"overflow-hidden bg-hero pb-10"}>
                {/*<img src={a1.src} className={"absolute z-[-100]"}/>*/}
                <div className={"text-black text-center m-8"}>
                    <h1 className={"text-3xl font-bold m-1"}>Výkup <span className={""}>Resell</span>.<span className={""}>cz</span></h1>
                    <p className={"text-gray-700 text-lg"}>Vytvoření faktury</p>
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

    const [personalInfo, setPersonalInfo] = useState<PersonalInfoProps | undefined>(undefined);
    const [productInfo, setProductInfo] = useState<ProductProps | undefined>(undefined);
    const [finalInfo, setFinalInfo] = useState<FinalProps | undefined>(undefined);
    const [cin, setCin] = useState<boolean>(false);

    const handleScreenSubmit = (forward: boolean) => {
        setCurrStep(currStep + (forward ? 1 : -1));
    }

    const screens = [
        {
            title: "IČO",
            content: <FormIcoScreen handleSubmit={(cin) => {
                setCin(cin);
                handleScreenSubmit(true);
            }}/>
        },
        {
            title: "Osobní údaje",
            content: <FormPersonalInfoScreen prevProps={personalInfo} handleSubmit={(props, forward) => {
                setPersonalInfo(props);
                handleScreenSubmit(forward);
            }}/>
        },
        {
            title: "Produkt",
            content: <FormProductScreen prevProps={productInfo} cin={cin} handleSubmit={(props, forward) => {
                setProductInfo(props);
                handleScreenSubmit(forward);
            }}/>
        },
        {
            title: "Datum a podpis",
            content: <FormFinalScreen prevProps={finalInfo} handleSubmit={(props, forward) => {
                setFinalInfo(props);
                handleScreenSubmit(forward);
            }}/>
        },
        {
            title: "Hotovo",
            content: <FormResultScreen/>
        }
    ]

    return (
        <>
            <StepBar currStep={currStep} steps={screens.map((screen) => screen.title)}/>
            <form className={"relative min-h-[600px] pb-28 flex flex-col gap-3 p-6 rounded w-[32rem] shadow-md border border-gray-200  mx-auto backdrop-blur-lg bg-white bg-opacity-70"}>
                {screens[currStep].content}
            </form>
        </>
    );
}

