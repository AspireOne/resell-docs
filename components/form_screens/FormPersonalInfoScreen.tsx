import FormElement, {CustomInputFormElement} from "../FormElement";
import {useState} from "react";
import FormNavigationButtons from "../FormButtons";
import CustomCombobox from "../CustomCombobox";
import {useTranslation} from "react-i18next";

export interface PersonalInfoProps {
    nameOrCompany: string;
    email: string;
    street: string;
    city: string;
    countryCode: string;
    countryName: string;
    postalCode: string;
}

const countries = [
    ["Czech Republic", "CZ"],
    ["Slovakia", "SK"],
    ["Poland", "PL"],
    ["France", "FR"],
    ["Germany", "DE"],
    ["Italy", "IT"],
    ["Spain", "ES"],
    ["Great Britain", "GB"],
    ["Austria", "AT"],
    ["Belgium", "BE"],
    ["Netherlands", "NL"],
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
    const [countryName, setCountryName] = useState<string>(props.prevProps?.countryName ?? "");

    const {t} = useTranslation();

    function handleSubmit(forward: boolean) {
        // Get countryCode code from countries array by countryCode name.
        const countryCode = countries.find((pair) => pair[0] === countryName)?.[1] ?? "";

        const data: PersonalInfoProps = { nameOrCompany: name, email: email, street: street, city: city,
            countryCode: countryCode, countryName: countryName, postalCode: postalCode };
        if (!forward) props.handleSubmit(data, forward);

        let error = false;

        if (name.length < 3) {
            setNameError(t("screens.personal.error.name"));
            error = true;
        } else {
            setNameError(null);
        }

        // Email regex.
        if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) {
            setEmailError(t("screens.personal.error.email"));
            error = true;
        } else {
            setEmailError(null);
        }

        if (street.length < 3) {
            setStreetError(t("screens.personal.error.street"));
            error = true;
        } else {
            setStreetError(null);
        }

        if (city.length < 3) {
            setCityError(t("screens.personal.error.city"));
            error = true;
        } else {
            setCityError(null);
        }

        if (postalCode.length < 3) {
            setPostalCodeError(t("screens.personal.error.zip"));
            error = true;
        } else {
            setPostalCodeError(null);
        }

        if (countryName.length < 3) {
            setCountryError(t("screens.personal.error.country"));
            error = true;
        } else {
            setCountryError(null);
        }

        if (!error) {
            props.handleSubmit(data, forward);
        }
    }

    return (
        <div className={"flex flex-col gap-3"}>
            <FormElement name={"name"} type={"name"} placeholder={"Jan Novak"} title={t("screens.personal.label.name") ?? ""}
                         value={name} error={nameError} onValueChanged={(val) => {setNameError(null); setName(val)}}
            />

            <FormElement name={"email"} type={"email"} placeholder={"jmeno@spolecnost.com"} title={t("screens.personal.label.email") ?? ""}
                         value={email} error={emailError} onValueChanged={(val) => {setEmailError(null); setEmail(val)}}
            />

            <div className="flex flex-row gap-2 justify-center">
                <FormElement name={"city"} type={"text"} placeholder={"Praha"} title={t("screens.personal.label.city") ?? ""}
                             value={city} error={cityError} onValueChanged={(val) => {setCityError(null); setCity(val)}}
                />
                <FormElement name={"postal-code"} type={"text"} placeholder={"123 45"} title={t("screens.personal.label.zip") ?? ""}
                             value={postalCode} error={postalCodeError} onValueChanged={(val) => {setPostalCodeError(null); setPostalCode(val)}}
                />
            </div>

            <FormElement name={"street"} type={"text"} placeholder={"Dlouhá 123"} title={t("screens.personal.label.street") ?? ""}
                         value={street} error={streetError} onValueChanged={(val) => {setStreetError(null); setStreet(val)}}
            />

            <CustomInputFormElement name={"country"} title={t("screens.personal.label.country") ?? ""} error={countryError}>
                <CustomCombobox initialValue={countryName} items={countries.map(pair => pair[0])} onChange={(val) => {
                    setCountryError(null); setCountryName(val)}
                }/>
            </CustomInputFormElement>

            <FormNavigationButtons handleClick={handleSubmit} />
        </div>
    );
}