import {motion} from "framer-motion";
import {
    AlertCircle,
    CheckmarkCircle,
    CloseCircle,
    EllipsisHorizontalCircle
} from "react-ionicons";

export default function FormResultScreen(props: {state: "loading" | "failed" | "warning" | "success", message: string}) {
    // TODO: Implement checkmark, loading or failed icon, message etc.

    let icon;
    let animate = true;
    switch (props.state) {
        case "loading":
            icon = <EllipsisHorizontalCircle key={1} color={"gray"} height="100%" width="100%" cssClasses={"animate-pulse"}/>;
            break;
        case "failed":
            icon = <CloseCircle key={2} color={"red"} width={"100%"} height={"100%"}/>
            break;
        case "warning":
            icon = <AlertCircle key={3} color={"orange"} width={"100%"} height={"100%"}/>
            break;
        case "success":
            icon = <CheckmarkCircle key={4} color={"green"} width={"100%"} height={"100%"}/>
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
            <div className={"text-md text-gray-800"}>{props.message}</div>
        </div>
    );
}