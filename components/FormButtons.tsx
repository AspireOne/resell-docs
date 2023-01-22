import SubmitButton from "./SubmitButton";
import {useTranslation} from "react-i18next";

export default function FormNavigationButtons(props: {handleClick: (forward: boolean) => void, secondElement?: any}) {
    const {t} = useTranslation();

    return (
        <div className={"absolute bottom-5 left-6 right-6"}>
            <hr className={"mt-4 mb-1 h-2"} />

            <div className={"flex flex-row justify-between"}>
                <SubmitButton onClick={(e) => {
                    e.preventDefault();
                    props.handleClick(false)
                }} className={"w-28 px-2"}>
                    {t("main.buttons.back")}
                </SubmitButton>

                {
                    props.secondElement ??
                    <SubmitButton onClick={(e) => {
                        e.preventDefault();
                        props.handleClick(true);
                    }} className={"w-28 px-2"}>
                        {t("main.buttons.continue")}
                    </SubmitButton>
                }
            </div>
        </div>
    );
}