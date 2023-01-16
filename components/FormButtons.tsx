import SubmitButton from "./SubmitButton";

export default function FormNavigationButtons(props: {handleClick: (forward: boolean) => void, secondElement?: any}) {
    return (
        <div className={"absolute bottom-5 left-6 right-6"}>
            <hr className={"mt-4 mb-1 h-2"} />

            <div className={"flex flex-row justify-between"}>
                <SubmitButton onClick={(e) => {
                    e.preventDefault();
                    props.handleClick(false)
                }} className={"w-28 px-2"}>
                    Zpět
                </SubmitButton>

                {
                    props.secondElement ??
                    <SubmitButton onClick={(e) => {
                        e.preventDefault();
                        props.handleClick(true);
                    }} className={"w-28 px-2"}>
                        Pokračovat
                    </SubmitButton>
                }
            </div>
        </div>
    );
}