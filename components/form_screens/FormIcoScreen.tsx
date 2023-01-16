export default function FormIcoScreen(props: {handleSubmit: (ico: boolean) => void}) {
    return (
        <div className={"flex flex-row gap-5 w-fit mx-auto m-64"}>
            <button onClick={(e) => {e.preventDefault(); props.handleSubmit(true)}} className={"p-2 px-4 rounded border border-gray-500 w-40"}>Mám IČO</button>
            <button onClick={(e) => {e.preventDefault(); props.handleSubmit(false)}} className={"p-2 px-4 rounded border border-gray-500 w-40"}>Nemám IČO</button>
        </div>
    );
}