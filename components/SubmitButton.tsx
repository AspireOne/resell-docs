import {PropsWithChildren} from "react";
import {twMerge} from "tailwind-merge";

export default function SubmitButton(props: PropsWithChildren<{className?: string, onClick: (e: any) => void}>) {
    return (
        <button
            onClick={props.onClick}
            className={twMerge(`hover:shadow-form rounded-md bg-[#6A64F1] py-3 px-4 text-center text-base font-semibold text-white outline-none ${props.className || ""}`)}
        >
            {props.children}
        </button>
    );
}
