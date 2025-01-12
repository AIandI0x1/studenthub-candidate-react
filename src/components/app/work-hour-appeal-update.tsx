import { CandidateWorkingHourAppealUpdate } from "@/models/candidate-working-hour-appeal-updates";
import { dateTimeFormat } from "@/utils/common";
import { useState } from "react";

export function WorkHourAppealUpdate({ candidateWorkingHourAppealUpdate,onClick }: { onClick: any, candidateWorkingHourAppealUpdate: CandidateWorkingHourAppealUpdate}) {
    const [isNew, setIsNew] = useState(candidateWorkingHourAppealUpdate.is_new);

    return (
        <div onClick={() => onClick() && setIsNew(false)}
            className={ `${isNew? 'cursor-pointer': ''} relative my-4 p-4 bg-white rounded-lg shadow-[0px_0px_2px_0px_rgba(35,35,38,0.06)] flex-col justify-center 
            items-start gap-1.5 flex` }> 

            <div className="grow shrink basis-0 text-[#22223d] text-base font-medium leading-normal">
                {candidateWorkingHourAppealUpdate.createdBy.staff_name}
            </div>
        
            <div className="self-stretch text-[#4b4b61] text-sm font-normal leading-tight">
                { candidateWorkingHourAppealUpdate.update && <b>{candidateWorkingHourAppealUpdate.update}:</b>} {candidateWorkingHourAppealUpdate.detail}
            </div>
        
            <div className="grow shrink basis-0 text-[#22223d] text-xs font-normal leading-none mt-1">
                { dateTimeFormat(candidateWorkingHourAppealUpdate.created_at, 'EEE d MMM') }
            </div> 

            {isNew && (
                <span className="w-3.5 h-3.5 bg-blue-600 rounded-full absolute top-3 end-4"></span>
            )}
        </div>
    )
}