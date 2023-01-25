import {useState} from "react";
import FormElement from "../FormElement";
import FormNavigationButtons from "../FormButtons";
import {CustomInputFormElement} from "../FormElement";
import CustomCombobox from "../CustomCombobox";
import {useTranslation} from "react-i18next";

export interface ProductProps {
    shoeName: string;
    shoeSize: string;
    price: string;
    currency: string;
    cin: string;
    bankAccount: string;
    iban: string;
}

const currencies = [
    "CZK",
    "EUR",
    "USD",
]

export default function FormProductScreen(props: {prevProps?: ProductProps, cin: boolean, handleSubmit: (props: ProductProps, forward: boolean) => void}) {
    const [shoeNameError, setShoeNameError] = useState<string | null>(null);
    const [shoeSizeError, setShoeSizeError] = useState<string | null>(null);
    const [priceError, setPriceError] = useState<string | null>(null);
    const [currencyError, setCurrencyError] = useState<string | null>(null);
    const [cinError, setCinError] = useState<string | null>(null);
    const [bankAccountError, setBankAccountError] = useState<string | null>(null);
    const [ibanError, setIbanError] = useState<string | null>(null);

    const [cin, setCin] = useState<string>(props.prevProps?.cin ?? "");
    const [shoeName, setShoeName] = useState<string>(props.prevProps?.shoeName ?? "");
    const [shoeSize, setShoeSize] = useState<string>(props.prevProps?.shoeSize ?? "");
    const [price, setPrice] = useState<string>(props.prevProps?.price ?? "");
    const [currency, setCurrency] = useState<string>(props.prevProps?.currency ?? currencies[0]);
    const [bankAccount, setBankAccount] = useState<string>(props.prevProps?.bankAccount ?? "");
    const [iban, setIban] = useState<string>(props.prevProps?.iban ?? "");

    const {t} = useTranslation();

    function handleSubmit(forward: boolean) {
        const data = { shoeName: shoeName, shoeSize: shoeSize, price: price, currency: currency, cin: cin, bankAccount: bankAccount, iban: iban};
        if (!forward) props.handleSubmit(data, forward);

        let error: boolean | null = null;

        // Code out because CIN in other countries might have different lengths.
        if (props.cin && cin.length === 0) {
            setCinError(t("screens.product.error.cin"));
            error = true;
        } else {
            setCinError(null);
        }

        if (shoeName.length < 3) {
            setShoeNameError(t("screens.product.error.name"));
            error = true;
        } else {
            setShoeNameError(null);
        }

        if (shoeSize.length < 1) {
            setShoeSizeError(t("screens.product.error.size"));
            error = true;
        } else {
            setShoeSizeError(null);
        }

        if (price.length < 1) {
            setPriceError(t("screens.product.error.price"));
            error = true;
        } else {
            setPriceError(null);
        }

        if (currency.length < 3) {
            setCurrencyError(t("screens.product.error.currency"));
            error = true;
        } else {
            setCurrencyError(null);
        }

        if (iban !== "" && iban.length < 8) {
            setIbanError(t("screens.product.error.iban"));
            error = true;
        }

        if (bankAccount !== "" && bankAccount.length < 5) {
            setBankAccountError(t("screens.product.error.bankAccount"));
        } else {
            setBankAccountError(null);
        }

        if (iban === "" && bankAccount === "") {
            setBankAccountError(t("screens.product.error.ibanOrBankAccount"));
            setIbanError(t("screens.product.error.ibanOrBankAccount"));
            error = true;
        }

        if (!error) {
            props.handleSubmit(data, forward);
        }
    }

    return (
        <div className={"flex flex-col gap-3"}>
            <div className="flex flex-row gap-2 justify-center">
                <FormElement name={"shoe-name"} type={"text"} placeholder={"ADIDAS I-5923"} title={t("screens.product.label.name") ?? ""}
                             value={shoeName} error={shoeNameError} onValueChanged={(val) => {setShoeNameError(null); setShoeName(val)}}
                />
                <FormElement name={"shoe-size"} type={"number"} placeholder={"42"} title={t("screens.product.label.size") ?? ""}
                             value={shoeSize} maxLength={2} max={99} error={shoeSizeError} onValueChanged={(val) => {setShoeSizeError(null); setShoeSize(val)}}
                />
            </div>

            <div className="flex flex-row gap-2 justify-center">
                <FormElement name={"price"} type={"number"} step={500} placeholder={"0"} title={t("screens.product.label.price") ?? ""}
                             value={price} error={priceError} onValueChanged={(val) => {setPriceError(null); setPrice(val)}}
                />
                <CustomInputFormElement name={"currency"} title={t("screens.product.label.currency") ?? ""} error={currencyError}>
                    <CustomCombobox initialValue={currency} items={currencies} onChange={(val) => {setCurrencyError(null); setCurrency(val)}}/>
                </CustomInputFormElement>
            </div>

            {
                props.cin &&
                <FormElement name={"CIN"} type={"number"} placeholder={"12345678"} title={t("screens.product.label.cin") ?? ""}
                             value={cin} maxLength={8} max={99999999} className={"w-full"} error={cinError} onValueChanged={(val) => {setCinError(null); setCin(val)}}
                />
            }

            <div>
                <FormElement name={"bank-account"} type={"text"} placeholder={"2600111111/2010"} title={t("screens.product.label.bankAccount") ?? ""}
                             value={bankAccount} error={bankAccountError} onValueChanged={(val) => {
                                 setIbanError(null);
                                 setBankAccountError(null);
                                 setBankAccount(val);
                                 setIban("");
                             }
                }
                />

                <p className={"mt-3 -mb-5 text-center text-gray-500"}>{t("screens.product.label.or")}</p>

                <FormElement name={"iban"} type={"text"} placeholder={"CZ69 0710 1781 2400 0000 4159"} title={t("screens.product.label.iban") ?? ""}
                             value={iban} error={ibanError} onValueChanged={(val) => {
                                 setIbanError(null);
                                 setBankAccountError(null);
                                 setIban(val);
                                 setBankAccount("");
                             }
                }
                />
            </div>

            <FormNavigationButtons handleClick={handleSubmit} />
        </div>
    )
}