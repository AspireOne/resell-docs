import { useState, Fragment } from 'react'
import { Combobox } from '@headlessui/react'
import {CaretDown, Checkmark} from "react-ionicons";

export default function CustomCombobox(props: {items: string[], initialValue?: string, autocomplete?: string, onChange: (item: string) => void}) {
    const [selectedItem, setSelectedItem] = useState("")
    const [query, setQuery] = useState('')

    function handleChange(e: any) {
        setQuery(e.target.value);
        if (props.items.includes(e.target.value)) setSelectedItem(e.target.value);
    }

    function handleComboboxChange(item: string) {
        setSelectedItem(item);
        props.onChange(item);
    }

    const filteredItems = query === ''
        ? props.items
        : props.items.filter((item) => item.toLowerCase().includes(query.toLowerCase()))


    return (
        <Combobox value={selectedItem || props.initialValue || ""} onChange={handleComboboxChange}>
            <div className={"flex flex-row"}>
                <Combobox.Input
                    placeholder={props.items[0]}
                    autoComplete={props.autocomplete || "off"}
                    className={"w-full rounded-md border border-[#e0e0e0] py-3 px-4 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"}
                    onChange={(e) => handleChange(e)}
                    displayValue={(item: string) => item}
                />
                <Combobox.Button className={"-ml-10 pr-2"}>
                    <CaretDown height="auto" width={"30px"}/>
                </Combobox.Button>
            </div>
            <Combobox.Options className={"border shadow-md rounded-md"}>
                {filteredItems.map((item, i) => (
                    /* Use the `active` state to conditionally style the active option. */
                    /* Use the `selected` state to conditionally style the selected option. */
                    <Combobox.Option key={i} value={item} as={Fragment}>
                        {({ active, selected }) => (
                            <li
                                className={`rounded-md w-full py-3 px-4 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md ${
                                    active ? 'bg-[#756ff6] text-white' : 'bg-white text-black'
                                }`}
                            >
                                <div className={"flex flex-row gap-2"}>
                                    {item}
                                    {selected && <Checkmark color={active ? "#fff" : "#000000"} />}
                                </div>
                            </li>
                        )}
                    </Combobox.Option>
                ))}
            </Combobox.Options>
        </Combobox>
    )
}