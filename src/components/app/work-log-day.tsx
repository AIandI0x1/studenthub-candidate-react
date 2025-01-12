import i18n from "@/18n";
import { CandidateWorkingDate } from "@/models/candidate-working-date";
import { dateTimeFormat, secondsToTime } from "@/utils/common";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useIonRouter } from '@ionic/react';

export default function WorkLogDay({ candidateWorkingDate }: { candidateWorkingDate: CandidateWorkingDate}) {

    const {t } = useTranslation();
    const router = useIonRouter();

    useEffect(() => {
        //router.prefetch("/work-log/log-hour-list/[date]");
    })

    return (

        <div onClick={() => router.push('/work-log/log-hour-list/' + candidateWorkingDate.date)} className="cursor-pointer w-full h-[92px] p-4 bg-white rounded-lg shadow flex-col justify-center items-start gap-2 inline-flex mb-6">
            <div className="self-stretch h-[60px] flex-col justify-start items-start gap-2 flex">
                <div className="self-stretch justify-start items-start gap-2 inline-flex">
                    <div className="grow shrink basis-0 text-[#0f0f2c] text-lg font-medium leading-7">
                    {dateTimeFormat(candidateWorkingDate.date || '', 'eee, d MMM')}
                    </div>

                    { candidateWorkingDate.end_time && <div className="h-6 px-1.5 py-0.5 bg-[#f5f5f7] rounded-md justify-start items-center gap-2.5 inline-flex">
                        {candidateWorkingDate.total_pending > 0 && <div className="justify-start items-center gap-1 flex">
                            <div className="w-3.5 h-3.5 bg-[#f2994a] rounded-full"></div>
                            <div className="text-[#22223d] text-xs font-medium leading-none">
                                {candidateWorkingDate.total_pending}
                            </div>
                        </div> }

                        {candidateWorkingDate.total_approved > 0 && <div className="justify-start items-center gap-1 flex">
                            <div className="w-3.5 h-3.5 bg-[#28b563] rounded-full"></div>
                            <div className="text-[#22223d] text-xs font-medium leading-none">
                                {candidateWorkingDate.total_approved}
                            </div>
                        </div> }

                        {candidateWorkingDate.total_rejected > 0 && <div className="justify-start items-center gap-1 flex">
                            <div className="w-3.5 h-3.5 bg-[#eb5757] rounded-full"></div>
                            <div className="text-[#22223d] text-xs font-medium leading-none">
                                {candidateWorkingDate.total_rejected}
                            </div>
                        </div> }

                    </div> }

                    { !candidateWorkingDate.end_time && <div className="h-6 px-1.5 py-0.5 bg-[#f5f5f7] rounded-md justify-start items-center gap-2.5 inline-flex">
                        <div className="justify-start items-center gap-1 flex">
                            <div className="w-3.5 h-3.5 bg-[#4c6ff2] rounded-full"></div>
                            <div className="text-[#22223d] text-xs font-medium leading-none">
                                {t('Working')}
                            </div>
                        </div>
                    </div> }
                </div>
                <div className="self-stretch justify-start items-start gap-1 inline-flex">
                    <div className="grow shrink basis-0 text-[#22223d] text-base font-medium leading-normal">
                    {candidateWorkingDate.end_time ? 
                                secondsToTime(candidateWorkingDate.total_time || 0) : t("On-Going")}
                    </div>
                    <div className="justify-end items-center gap-2 flex">
                        <div className="text-[#4b4b61] text-sm font-normal leading-tight">{dateTimeFormat(candidateWorkingDate.start_time || '', 'hh:mm a')}</div>
                        <div className="w-6 h-6 relative">
                            <span className={ i18n.language == 'ar'? "inline-block rotate-180 me-2": 'mx-2' }>→</span>
                        </div>
                        <div className="text-[#4b4b61] text-sm font-normal leading-tight">
                            {candidateWorkingDate.end_time ? dateTimeFormat(candidateWorkingDate.end_time, 'hh:mm a') : t("Now")}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}