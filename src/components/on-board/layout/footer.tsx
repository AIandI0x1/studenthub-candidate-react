import { useTranslation } from "react-i18next";
import OnboardNav from "../navigation";
import NeedHelp from "../need-help";

export default function OnboardFooter() {

    const { i18n } = useTranslation();

    return (

        <div className={ `text-center fixed bottom-[16px] start-1/2 
            ${i18n.language === 'ar' ? 'translate-x-[62px]' : '-translate-x-[76px]'} 
            items-center justify-center block` }>

            <OnboardNav></OnboardNav>

            <NeedHelp></NeedHelp>
        </div>
    );
}