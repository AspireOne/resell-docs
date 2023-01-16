import {ChangeEvent, ReactNode} from "react";

export default function FormElement(props: {
    name: string,
    type?: string,
    placeholder: string,
    title: string,
    className?: string,
    step?: number,
    error?: string | null,
    max?: number,
    maxLength?: number,
    min?: number,
    value?: string,
    onValueChanged?: (value: string) => void,
    customInputElement?: ReactNode}) {
    return (
        <div>
            <label
                htmlFor={props.name}
                className="mb-3 block text-base font-medium text-[#07074D]"
            >
                {props.title}
            </label>
            {
                props.customInputElement ??
                <input
                    type={props.type ?? "text"}
                    name={props.name}
                    max={props.max}
                    maxLength={props.maxLength}
                    min={props.min}
                    step={props.step}
                    placeholder={props.placeholder}
                    onChange={(e) => props.onValueChanged && props.onValueChanged(e.target.value)}
                    value={props.value ?? ""}
                    className={`w-full rounded-md border border-[#e0e0e0] py-3 px-4 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md ${props.className ?? ""} ${props.error ? "bg-red-100 bg-opacity-70" : "bg-white"}`}
                />
            }
            {props.error && <p className={"text-red-500 text-sm"}>{props.error}</p>}
        </div>
    );
}