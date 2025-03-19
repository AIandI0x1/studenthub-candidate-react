import { Candidate } from "@/models/candidate";
import { IonIcon } from "@ionic/react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { updateJobSearchStatus } from "@/providers/logged-in/account.service";
import { setUser } from "@/store/slices/userSlice";
import { useAppSelector } from "@/store/store";
import { useAppDispatch } from "@/store/store";
import { errorMessage } from "@/utils/common";
import { alertDialog } from "@/hooks/use-alert-dialog";

const JobSearchStatus = ({ candidate }: { candidate: Candidate }) => {

    const [showStatusList, setShowStatusList] = useState<boolean>(false);

    const { t } = useTranslation();

    const dispatch = useAppDispatch();
    const user = useAppSelector((state: any) => state.user.user);

    const updateStatus = (status: number) => {

        setShowStatusList(false);

        updateJobSearchStatus({
            job_search_status: status
        }).then((res: any) => {
            if (res.operation == 'success') {
                
                if (user) {
                    dispatch(setUser({ user: {
                        ...user,
                        candidate_job_search_status: status
                    } }));
                }
            } else {
                alertDialog({
                    title: t("Error"),
                    description: errorMessage(res.message),
                });
            }
        });
    }

    return (
        <div className="relative mb-4">
            <div className="mt-4 w-full p-4 bg-white rounded-lg shadow-[0px_2px_4px_0px_rgba(0,0,0,0.10)] inline-flex flex-col justify-start items-start gap-2">
                <h5 className="self-stretch justify-start text-[#0f0f2c] text-base font-semibold leading-normal">
                    <img className='w-6 h-6 inline me-2' src="/assets/images/icon-suitcase.svg" />
                    {t("Candidate’s Job Seeking Status")}
                </h5>
                <div className="self-stretch justify-start text-[#4b4b61] text-sm font-normal leading-tight">
                    {t("Adjust your preferences to control how and when we connect you with potential opportunities.")}
                </div>
                <div data-helper-Text="Off" data-state="filled" data-type="Dropdown" onClick={() => setShowStatusList(!showStatusList)} className="cursor-pointer self-stretch h-12 inline-flex flex-col justify-start items-start gap-[7px]">
                    <div className="self-stretch px-4 pt-1.5 pb-2 bg-white rounded-lg outline outline-1 outline-offset-[-1px] outline-[#e2e2e6] inline-flex justify-start items-center gap-2">
                        <div className="self-stretch inline-flex flex-col justify-start items-start">
                            <div className="w-[177px] justify-start text-[#68687a] text-[10px] font-medium leading-[14px] tracking-wide">
                                {t("You are currently")}
                            </div>
                            <div className="justify-start text-[#22223d] text-sm font-medium leading-tight">
                                {candidate.candidate_job_search_status == 1 ? t("Actively Looking for a Job") :
                                    candidate.candidate_job_search_status == 2 ? t("Not looking but open to offers") :
                                        t("Not Looking and closed to offers")}
                            </div>
                        </div>
                        <div className="inline-flex flex-col justify-start items-start">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M4.86612 7.86612C5.35427 7.37796 6.14573 7.37796 6.63388 7.86612L11.75 12.9822L16.8661 7.86612C17.3543 7.37796 18.1457 7.37796 18.6339 7.86612C19.122 8.35427 19.122 9.14573 18.6339 9.63388L12.6339 15.6339C12.1457 16.122 11.3543 16.122 10.8661 15.6339L4.86612 9.63388C4.37796 9.14573 4.37796 8.35427 4.86612 7.86612Z" fill="#7D7D8D"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {showStatusList && <div className={`absolute top-[calc(100%-10px)] left-0 z-10 w-[309px] p-2.5 bg-white rounded-lg shadow-[0px_0px_8px_0px_rgba(35,35,38,0.08)] 
        inline-flex flex-col justify-start items-start gap-2.5 overflow-hidden` }>
                <div onClick={() => updateStatus(1)}
                    className={`cursor-pointer self-stretch pl-1.5 py-1.5 bg-white rounded inline-flex justify-start items-start gap-1.5 overflow-hidden ${candidate.candidate_job_search_status == 1 ? 'selected' : ''}`}>
                    <div className="w-6 h-6 relative">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 17.3332C5 15.615 7.08934 14.2221 9.66666 14.2221C12.244 14.2221 14.3333 15.615 14.3333 17.3332" stroke="#29B564" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M9.6658 11.8889C11.384 11.8889 12.7769 10.496 12.7769 8.7778C12.7769 7.05958 11.384 5.66669 9.6658 5.66669C7.94758 5.66669 6.55469 7.05958 6.55469 8.7778C6.55469 10.496 7.94758 11.8889 9.6658 11.8889Z" stroke="#29B564" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M15.25 12.125L16.5 13.375L19 10.5625" stroke="#29B564" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div className="flex-1 pr-1 inline-flex flex-col justify-start items-start">
                        <div className="justify-start text-[#22223d] text-sm font-semibold leading-tight">
                            {t("Actively Looking for a Job")}
                        </div>
                        <div className="self-stretch justify-start text-[#22223d] text-[10px] font-medium leading-[14px] tracking-wide">
                            {t("We will reach out to you to offer and discuss job opportunities.")}
                        </div>
                    </div>
                </div>

                <div onClick={() => updateStatus(2)}
                    className={`cursor-pointer self-stretch pl-1.5 py-1.5 bg-white rounded inline-flex justify-start 
  items-start gap-1.5 overflow-hidden ${candidate.candidate_job_search_status == 2 ? 'selected' : ''}`}>
                    <div className="w-6 h-6 relative">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 17.3332C5 15.615 7.08934 14.2221 9.66666 14.2221C12.244 14.2221 14.3333 15.615 14.3333 17.3332" stroke="#4C70F2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M9.6658 11.8889C11.384 11.8889 12.7769 10.496 12.7769 8.7778C12.7769 7.05958 11.384 5.66669 9.6658 5.66669C7.94758 5.66669 6.55469 7.05958 6.55469 8.7778C6.55469 10.496 7.94758 11.8889 9.6658 11.8889Z" stroke="#4C70F2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <circle cx="16.5" cy="5.5" r="1.5" fill="#4C70F2" />
                            <circle cx="21" cy="3" r="3" fill="#4C70F2" />
                        </svg>

                    </div>
                    <div className="flex-1 pr-1 inline-flex flex-col justify-start items-start">
                        <div className="self-stretch justify-start text-[#22223d] text-sm font-semibold leading-tight">
                            {t("Not looking but open to offers")}
                        </div>
                        <div className="self-stretch justify-start text-[#a4a4af] text-[10px] font-medium leading-[14px] tracking-wide">
                            {t("We will reach out to you about offers that match your preferences.")}
                        </div>
                    </div>
                </div>
                <div onClick={() => updateStatus(0)}
                    className={`cursor-pointer self-stretch pl-1.5 py-1.5 bg-white rounded inline-flex justify-start items-start gap-1.5 overflow-hidden ${candidate.candidate_job_search_status == 0 ? 'selected' : ''}`}>
                    <div className="w-6 h-6 relative">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 17.3332C5 15.615 7.08934 14.2221 9.66666 14.2221C12.244 14.2221 14.3333 15.615 14.3333 17.3332" stroke="#EB5757" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M15.8887 13.4445L18.9998 10.3334" stroke="#EB5757" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M15.8887 10.3334L18.9998 13.4445" stroke="#EB5757" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M9.6658 11.8889C11.384 11.8889 12.7769 10.496 12.7769 8.7778C12.7769 7.05958 11.384 5.66669 9.6658 5.66669C7.94758 5.66669 6.55469 7.05958 6.55469 8.7778C6.55469 10.496 7.94758 11.8889 9.6658 11.8889Z" stroke="#EB5757" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>

                    </div>
                    <div className="flex-1 pr-1 inline-flex flex-col justify-start items-start">
                        <div className="self-stretch justify-start text-[#22223d] text-sm font-semibold leading-tight">
                            {t("Not Looking and closed to offers")}
                        </div>
                        <div className="self-stretch justify-start text-[#a4a4af] text-[10px] font-medium leading-[14px] tracking-wide">
                            {t("Can manage assignees, review worked hours, and request for hire")}
                        </div>
                    </div>
                </div>
            </div>}
        </div>
    );
};

export default JobSearchStatus;