import {CheckmarkCircle, CloseCircle} from "react-ionicons";

export default function StepBar(props: {steps: string[], currStep: number}) {
    return (
        <div className="max-w-xl mx-auto mt-4 pb-2">
            <div className="flex pb-3">
                <div className="flex-1"></div>

                {/*The following piece of code you are about to read gotta be the stupidest shit Iˇve ever typed.*/}
                <span className={"flex flex-row items-center relative pb-6 scale-90 sm:scale-100"}>
                {
                    props.steps.map((name, i) => {
                        const finished = i < props.currStep;

                        return (
                            <span key={i} className={"flex flex-row items-center"}>
                                <div className={"flex flex-col items-center"}>
                                    {/* Valerie? */}
                                    <StepCircle step={i+1} state={finished ? "finished" : "unfinished"}/>
                                    <p className={`absolute bottom-0 text-sm ${i == props.currStep && "font-bold"}`}>{name}</p>
                                </div>
                                {
                                    i+1 < props.steps.length &&
                                    <div className={`flex-1 px-2 rounded border-b-[5px] w-10 sm:w-14 transition duration-700 ${finished && "border-green-500"}`}></div>
                                }
                            </span>
                        );
                    })
                }
                </span>

                <div className="flex-1"></div>
            </div>
        </div>
    );
}

const StepCircle = (props: {state?: "unfinished" | "finished" | "incorrect", step: number}) => {
    if (!props.state || props.state === "unfinished") return <StepCircleWithNumber step={props.step}/>;

    const Icon = props.state === "finished" ? CheckmarkCircle : CloseCircle;
    return (
        <div className="flex-1">
            <div className={"w-10 h-10 -m-4 mx-auto rounded-full text-lg text-white flex items-center animate-[spin_1s_ease-in-out_forwards]"}>
                <Icon color={"#17a432"} cssClasses={"-ml-1"} height={"120%"} width={"120%"}/>
            </div>
        </div>
    )
}

const StepCircleWithNumber = (props: {step: number}) => {
    return (
        <div className="flex-1">
            <div
                className="w-10 h-10 bg-white border-2 border-gray-200 mx-auto rounded-full text-lg text-white flex items-center">
                <span className="text-gray-600 text-center w-full">{props.step}</span>
            </div>
        </div>
    );
}