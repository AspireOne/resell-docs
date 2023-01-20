import {PropsWithChildren} from "react";

export default function SubmitButton(props: PropsWithChildren<{className?: string, onClick: (e: any) => void}>) {
    return (
        <button
            onClick={(e) => {
                e.preventDefault();
                props.onClick(e);
            }}
            className={`hover:shadow-form rounded-md bg-[#6A64F1] py-3 px-4 text-center text-base font-semibold text-white outline-none transition transition-100 hover:bg-[#605af6] ${props.className ?? ""}`}
        >
            {props.children}
        </button>
    );
}
