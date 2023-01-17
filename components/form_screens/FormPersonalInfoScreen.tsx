import FormElement, {CustomInputFormElement} from "../FormElement";
import {useState} from "react";
import SubmitButton from "../SubmitButton";
import FormNavigationButtons from "../FormButtons";
import {Combobox} from "@headlessui/react";
import CustomCombobox from "../CustomCombobox";

export interface PersonalInfoProps {
    nameOrCompany: string;
    email: string;
    street: string;
    city: string;
    country: string;
    postalCode: string;
}

const countries = [
    "Česko",
    "Polsko",
    "Francie",
    "Itálie",
    "Rakousko",
    "Německo",
    "Slovensko",
    "USA",
]

export default function FormPersonalInfoScreen(props: {prevProps?: PersonalInfoProps, handleSubmit: (props: PersonalInfoProps, forward: boolean) => void}) {
    // Errors.
    const [nameError, setNameError] = useState<string | null>(null);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [streetError, setStreetError] = useState<string | null>(null);
    const [cityError, setCityError] = useState<string | null>(null);
    const [postalCodeError, setPostalCodeError] = useState<string | null>(null);
    const [countryError, setCountryError] = useState<string | null>(null);

    const [name, setName] = useState<string>(props.prevProps?.nameOrCompany ?? "");
    const [email, setEmail] = useState<string>(props.prevProps?.email ?? "");
    const [street, setStreet] = useState<string>(props.prevProps?.street ?? "");
    const [city, setCity] = useState<string>(props.prevProps?.city ?? "");
    const [postalCode, setPostalCode] = useState<string>(props.prevProps?.postalCode ?? "");
    const [country, setCountry] = useState<string>(props.prevProps?.country ?? "");

    function handleSubmit(forward: boolean) {
        const data = { nameOrCompany: name, email: email, street: street, city: city, country: country, postalCode: postalCode };
        if (!forward) props.handleSubmit(data, forward);

        let error = false;

        if (name.length < 3) {
            setNameError("Jméno nebo název musí mít alespoň 3 znaky.");
            error = true;
        } else {
            setNameError(null);
        }

        // Email regex.
        if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
            setEmailError("Zkontrolujte svůj e-mail.");
            error = true;
        } else {
            setEmailError(null);
        }

        if (street.length < 3) {
            setStreetError("Ulice musí mít alespoň 3 znaky.");
            error = true;
        } else {
            setStreetError(null);
        }

        if (city.length < 3) {
            setCityError("Město musí mít alespoň 3 znaky.");
            error = true;
        } else {
            setCityError(null);
        }

        if (postalCode.length < 3) {
            setPostalCodeError("PSČ musí mít 5 čísel.");
            error = true;
        } else {
            setPostalCodeError(null);
        }

        if (country.length < 3) {
            setCountryError("Země musí mít alespoň 3 znaky.");
            error = true;
        } else {
            setCountryError(null);
        }

        if (!error) {
            props.handleSubmit(data, forward);
        }
    }

    return (
        <>
            <FormElement name={"name"} type={"name"} placeholder={"Jan Novák"} title={"Název / Jméno a Příjmení"}
                         value={name} error={nameError} onValueChanged={(val) => {setNameError(null); setName(val)}}
            />

            <FormElement name={"email"} type={"email"} placeholder={"jmeno@spolecnost.cz"} title={"E-mail"}
                         value={email} error={emailError} onValueChanged={(val) => {setEmailError(null); setEmail(val)}}
            />

            <div className="flex flex-row gap-2 justify-center">
                <FormElement name={"city"} type={"text"} placeholder={"Praha"} title={"Město"}
                             value={city} error={cityError} onValueChanged={(val) => {setCityError(null); setCity(val)}}
                />
                <FormElement name={"postal-code"} type={"text"} placeholder={"123 45"} title={"PSČ"}
                             value={postalCode} error={postalCodeError} onValueChanged={(val) => {setPostalCodeError(null); setPostalCode(val)}}
                />
            </div>

            <FormElement name={"street"} type={"text"} placeholder={"Dlouhá 123"} title={"Ulice"}
                         value={street} error={streetError} onValueChanged={(val) => {setStreetError(null); setStreet(val)}}
            />

            <CustomInputFormElement name={"country"} title={"Země"} error={countryError}>
                <CustomCombobox initialValue={country} items={countries} autocomplete={"country_name"} onChange={(val) => {
                    setCountryError(null); setCountry(val)}
                }/>
            </CustomInputFormElement>

            <FormNavigationButtons handleClick={handleSubmit} />
        </>
    );
}