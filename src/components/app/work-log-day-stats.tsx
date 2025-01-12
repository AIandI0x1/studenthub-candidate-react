import { CandidateWorkingDate } from "@/models/candidate-working-date";
import { dateTimeFormat, secondsToTime } from "@/utils/common";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

export function WorkLogDayStats({ candidateWorkingDate}: { candidateWorkingDate: CandidateWorkingDate}) {
    const { t } = useTranslation();
    
    return (
        <div className="p-4 bg-white mb-6 rounded-lg shadow flex-col justify-start items-center gap-4 flex">
            <div className="self-stretch justify-start items-start gap-2 flex">
                <div className="grow shrink basis-0 flex-col justify-center items-start gap-2 inline-flex">
                    <div className="text-[#7d7d8d] text-sm font-medium  leading-tight">
                      {t("Total Time")}
                    </div>
                    <div className="text-[#22223d] text-xl font-semibold  leading-7">
                    {candidateWorkingDate.total_time
                      ? secondsToTime(candidateWorkingDate.total_time)
                      : t("On-Going")}
                    </div>
                </div>
            </div>
            <div className="self-stretch h-px bg-[#eeeef0]"></div>
            <div className="self-stretch justify-between items-start flex">
                <div className="justify-start items-start gap-1 flex">
                    <div className="text-[#22223d] text-sm font-semibold  leading-tight">
                      {t("Start Time")}:</div>
                    <div className="text-[#4b4b61] text-sm font-normal  leading-tight">
                    {candidateWorkingDate.start_time
                          ? dateTimeFormat(candidateWorkingDate.start_time || '', 'hh:mm a') 
                          : '-'}
                    </div>
                </div>
                <div className="justify-end items-center gap-1 flex">
                    <div className="text-[#22223d] text-sm font-semibold  leading-tight">
                      {t("End Time")}:</div>
                    <div className="text-[#4b4b61] text-sm font-normal  leading-tight">
                    {candidateWorkingDate.end_time
                          ? dateTimeFormat(candidateWorkingDate.end_time || '', 'hh:mm a') 
                          : t("Now")}
                    </div>
                </div>
            </div>
            <div className="self-stretch justify-start items-center gap-2.5 flex">
                {!candidateWorkingDate.end_time && (<div className="px-1.5 py-0.5 bg-[#f5f5f7] rounded-md justify-start items-center gap-2.5 flex">
                    <div className="justify-start items-center gap-1 flex">
                        <div className="w-3.5 h-3.5 bg-[#4c6ff2] rounded-full"></div>
                        <div className="text-[#22223d] text-xs font-medium  leading-none">{candidateWorkingDate.total_pending} {t("Working")}</div>
                    </div>
                </div>)}

                {candidateWorkingDate.end_time && (<>  
                {candidateWorkingDate.total_pending > 0 && (<div className="px-1.5 py-0.5 bg-[#f5f5f7] rounded-md justify-start items-center gap-2.5 flex">
                    <div className="justify-start items-center gap-1 flex">
                        <div className="w-3.5 h-3.5 bg-[#f2994a] rounded-full"></div>
                        <div className="text-[#22223d] text-xs font-medium  leading-none">{candidateWorkingDate.total_pending} {t("Pending")}</div>
                    </div>
                </div>)}
                {candidateWorkingDate.total_approved > 0 && (<div className="px-1.5 py-0.5 bg-[#f5f5f7] rounded-md justify-start items-center gap-2.5 flex">
                    <div className="justify-start items-center gap-1 flex">
                        <div className="w-3.5 h-3.5 bg-[#28b563] rounded-full"></div>
                        <div className="text-[#22223d] text-xs font-medium  leading-none">{candidateWorkingDate.total_approved} {t("Approved")}</div>
                    </div>
                </div>)}
                {candidateWorkingDate.total_rejected > 0 && (<div className="px-1.5 py-0.5 bg-[#f5f5f7] rounded-md justify-start items-center gap-2.5 flex">
                    <div className="justify-start items-center gap-1 flex">
                        <div className="w-3.5 h-3.5 bg-[#eb5757] rounded-full"></div>
                        <div className="text-[#22223d] text-xs font-medium  leading-none">{candidateWorkingDate.total_rejected} {t("Rejected")}</div>
                    </div>
                </div>)}
                </>)}
            </div>
          </div> 
    );
}
 