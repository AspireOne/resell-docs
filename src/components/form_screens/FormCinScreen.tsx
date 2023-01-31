import Button from "../Button";
import {useTranslation} from "react-i18next";

export default function FormCinScreen(props: {key?: string, handleSubmit: (ico: boolean) => void}) {
    const { t } = useTranslation();

    return (
        <div className={"flex flex-row gap-5 w-fit mx-auto mt-64"}>
            <Button onClick={() => props.handleSubmit(true)} className={"w-36"}>{t("screens.cin.have")}</Button>
            <Button onClick={() => props.handleSubmit(false)} className={"w-36"}>{t("screens.cin.dontHave")}</Button>
        </div>
    );
}