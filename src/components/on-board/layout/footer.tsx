import OnboardNav from "../navigation";
import NeedHelp from "../need-help";

export default function OnboardFooter() {
    return (

        <div className="text-center fixed bottom-[16px] start-1/2 -translate-x-[76px] items-center justify-center block">

            <OnboardNav></OnboardNav>

            <NeedHelp></NeedHelp>
        </div>
    );
}