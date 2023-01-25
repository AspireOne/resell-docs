import {PropsWithChildren} from "react";
import Spinner from "./Spinner";

export default function SubmitButton(props: PropsWithChildren<{className?: string, loading?: boolean, onClick: (e: any) => void}>) {
    return (
        <button
            disabled={props.loading}
            onClick={(e) => {
                e.preventDefault();
                props.onClick(e);
            }}
            className={`hover:shadow-form rounded-md ${props.loading ? "bg-[#5c57d4]" : "bg-[#6A64F1]"} py-3 px-4 text-center text-base font-semibold text-white outline-none transition transition-100 hover:bg-[#605af6] ${props.loading && "cursor-not-allowed"} ${props.className ?? ""}`}
        >
            {props.loading && <Spinner/>}
            {props.children}
        </button>
    );
}
