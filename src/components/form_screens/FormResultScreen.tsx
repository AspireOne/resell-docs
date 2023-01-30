import {motion} from "framer-motion";
import {
    AlertCircle,
    CheckmarkCircle,
    CloseCircle,
    EllipsisHorizontalCircle
} from "react-ionicons";
import SubmitButton from "../SubmitButton";
import {useTranslation} from "react-i18next";

export default function FormResultScreen(props: {state: "loading" | "failed" | "warning" | "success", message: string, downloadLink: string | null, downloadLoading: boolean}) {
    // use t function to translate.
    const {t } = useTranslation();

    let icon;
    let animate = true;
    switch (props.state) {
        case "loading":
            icon = <EllipsisHorizontalCircle key={1} color={"gray"} height="100%" width="100%" cssClasses={"animate-pulse"}/>;
            animate = false;
            break;
        case "failed":
            icon = <CloseCircle key={2} color={"red"} width={"100%"} height={"100%"} cssClasses={""}/>
            break;
        case "warning":
            icon = <AlertCircle key={3} color={"orange"} width={"100%"} height={"100%"} cssClasses={""}/>
            break;
        case "success":
            icon = <CheckmarkCircle key={4} color={"green"} width={"100%"} height={"100%"} cssClasses={""}/>
            break;
    }

    return (
        <div className={"flex flex-col gap-3 justify-center items-center"}>
            <div  className={"w-32 h-32 mt-32"}>
                {!animate ? icon : (
                    <motion.div
                        initial={{rotate: 110, opacity: 0}}
                        animate={{rotate: 360, opacity: 1}}
                        transition={{ ease: "easeOut", duration: 0.4 }}>
                        {icon}
                    </motion.div>
                )}
            </div>
            <div className={"text-md text-gray-800 text-center mb-3"}>{props.message}</div>
            {
                // Framer animation fade in.
                props.downloadLink &&
                <motion.div
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{ ease: "easeOut", duration: 0.4 }}>
                    <SubmitButton loading={props.downloadLoading} onClick={() => {
                        const link = document.createElement('a');
                        link.href = props.downloadLink as string;
                        link.download = "invoice_" + new Date().toISOString().split('T')[0] + ".pdf";
                        link.click();
                    }}>
                        <a href={props.downloadLink}>{t("screens.result.buttons.download")}</a>
                    </SubmitButton>
                </motion.div>
            }
        </div>
    );
}