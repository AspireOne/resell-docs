import SubmitButton from "../SubmitButton";

export default function FormIcoScreen(props: {handleSubmit: (ico: boolean) => void}) {
    return (
        <div className={"flex flex-row gap-5 w-fit mx-auto mt-64"}>
            <SubmitButton onClick={() => props.handleSubmit(true)} className={"w-36"}>Mám IČO</SubmitButton>
            <SubmitButton onClick={() => props.handleSubmit(false)} className={"w-36"}>Nemám IČO</SubmitButton>
        </div>
    );
}