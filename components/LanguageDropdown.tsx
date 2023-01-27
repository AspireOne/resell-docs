import {useTranslation} from "react-i18next";
import {PL, US, CZ, DE} from "country-flag-icons/react/3x2";
import {Language} from "react-ionicons";


const languages = [
    {lang: "en", flag: US, name: "English"},
    {lang: "cs", flag: CZ, name: "Čeština"},
]

const languagesBeta = [
    {lang: "pl", flag: PL, name: "Polski"},
    {lang: "de", flag: DE, name: "Deutsch"},
]
export default function LanguageDropdown() {
    const {t, i18n} = useTranslation();

    const DropdownItem = (props: {icon: any, lang: string, name: string}) => {
        const selected = props.lang == i18n.language;

        return (
            <div onClick={() => i18n.changeLanguage(props.lang)} className={`flex flex-row gap-2 p-2 rounded-lg ${selected && "bg-gray-400"} ${!selected && "hover:bg-gray-200"}`}>
                <props.icon className={"w-4 pointer-events-none"}/>
                <label className={"pointer-events-none"}>{props.name}</label>
            </div>
        );
    }

    // get current language flag.
    const CurrentFlag = languages.find((l) => l.lang == i18n.language)?.flag;

    return (
        <div className={"m-3 sm:m-6 -mb-12"}>
            <div className="dropdown dropdown-bottom">
                <div tabIndex={0} className="btn normal-case flex flex-row gap-2">
                    {
                        CurrentFlag &&
                        <CurrentFlag className={"w-4"}/>
                    }
                    <p className={"sm:ml-0 hidden sm:block"}>Language</p>
                </div>

                <ul tabIndex={0} className="text-black dropdown-content menu p-2 shadow bg-base-100 rounded-box w-32 flex flex-col gap-1">
                    {
                        languages.map((lang) =>
                            <DropdownItem key={lang.lang} icon={lang.flag} lang={lang.lang} name={lang.name}/>)
                    }
                    <div className={"flex flex-row items-center gap-2"}>
                        <p className={"text-sm text-gray-500"}>Beta</p>
                        <hr className={"my-2 w-full"}/>
                    </div>
                    {
                        languagesBeta.map((lang) =>
                            <DropdownItem key={lang.lang} icon={lang.flag} lang={lang.lang} name={lang.name}/>)
                    }
                </ul>
            </div>
        </div>
    )
}