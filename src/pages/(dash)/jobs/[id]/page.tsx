"use client"

import { Suspense, useState, useEffect } from "react";
import Loading from "./loading";
import { Button } from "@/components/ui/button";
import { page, track } from "@/providers/analytics.service";
import Apply from "@/components/modals/apply/page";
import { viewJob } from "@/providers/logged-in/job.service";
import { useParams } from "react-router-dom";    
import { Job } from "@/models/job";
import { dateTimeFormat, langContent } from "@/utils/common";
import { useTranslation } from "react-i18next";
import JobSkills from "@/models/job-skills";
import { TimeAgo } from "@/components/common/timeAgo";

export default function JobDetailPage() {

    const { t } = useTranslation();

    const [showApply, setShowApply] = useState(false);
    const [loading, setLoading] = useState(false);
    //const [timeAgo, setTimeAgo] = useState<string | null>(null);

    const { id } = useParams() as { id: string };
    const [job, setJob] = useState<Job | null>(null);
    //let { timeAgo, setTimeAgo } = useTimeAgo('', t);

    let seen_at = (new Date()).toISOString();

    useEffect(() => {

        // Analytics tracking

        page('Job Detail Page');

        seen_at = (new Date()).toISOString();

        loadData();

        return () => {
            track('page_exit', { page: 'Job Detail Page' });
        }
    }, [id]);


    function loadData() {

        setLoading(true);

        viewJob(id).then((res) => {
            setLoading(false);
           //setTimeAgo(res.created_at);
            setJob(res);
        });
    }

    function onApplyClose(data: any) {
         
        if (data.refresh) {
            setShowApply(false);
            loadData();
        }
    }

    return (
        <Suspense fallback={<Loading />}>
            {job && <>
                <div className=' bg-white'>
                    <div className="max-w-4xl mx-auto px-6 shadow-[0px_10px_20px_0px_rgba(0,0,0,0.05) xs:pt-0 sm:pt-6 pb-6">

                        <h5 className='text-[color:var(--Neutral-95,#23233D)] text-2xl font-bold leading-8 capitalize'>
                            {langContent(job.position, job.position_ar)}
                        </h5>

                        <div className="mt-1 text-[#7d7d8d] text-base font-medium leading-normal">
                            { t('Posted')} <TimeAgo time={job.created_at} />
                        </div>

                    </div>
                </div>

                <div className="max-w-4xl mx-auto p-6">
                    { !job.jobInterest && <Button className="xs:w-full sm:w-auto" onClick={() => setShowApply(true)}>
                        { t('Show Interest') }
                    </Button> }

                    { job.jobInterest && <div className="my-2.5 w-full bg-white rounded-lg shadow-[0px_2px_4px_0px_rgba(0,0,0,0.10)] overflow-hidden p-4 gap-4">
                        <div className="self-stretch justify-start items-center my-1">
                            <div className="my-1  text-[#22223d] text-lg font-bold leading-normal">
                                {t('Application Sent')}

                                <div className="w-5 h-5 relative float-end overflow-hidden">
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_2280_1730)">
                                    <path d="M18.3333 9.2333V9.99997C18.3323 11.797 17.7504 13.5455 16.6744 14.9848C15.5984 16.4241 14.086 17.477 12.3628 17.9866C10.6395 18.4961 8.79768 18.4349 7.11202 17.8121C5.42636 17.1894 3.98717 16.0384 3.00909 14.5309C2.03101 13.0233 1.56645 11.24 1.68469 9.4469C1.80293 7.65377 2.49763 5.94691 3.66519 4.58086C4.83275 3.21482 6.41061 2.26279 8.16345 1.86676C9.91629 1.47073 11.7502 1.65192 13.3916 2.3833" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M18.3333 3.33325L10 11.6749L7.5 9.17492" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </g>
                                    <defs>
                                    <clipPath id="clip0_2280_1730">
                                    <rect width="20" height="20" fill="white"/>
                                    </clipPath>
                                    </defs>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        
                        <div className="text-[#4b4b61] text-sm font-medium leading-tight my-4">
                            {t('Your application has been received and will be reviewed, goodluck!')}
                        </div>

                        <div className="my-1">
                            <div className="mb-1 w-full text-[#4b4b61] text-sm font-semibold leading-tight">
                                {t('Application')}:
                            </div>
                            <div className="w-full text-[#4b4b61] text-sm font-medium leading-tight">
                                “{ job.jobInterest.notes}”
                            </div>
                        </div> 

                    </div> }    

                    <div className="my-2.5 w-full bg-white rounded-lg shadow-[0px_2px_4px_0px_rgba(0,0,0,0.10)] flex-col justify-start items-start inline-flex overflow-hidden p-4 gap-4">
                        <div className="self-stretch justify-start items-center gap-1 inline-flex">
                            <div className="grow shrink basis-0 h-6 justify-start  gap-1 flex text-[#22223d] text-lg font-bold font-['Inter'] leading-normal">
                                    {t('Job Details')}
                            </div>
                        </div>
                        <div className="self-stretch h-6 justify-start items-center gap-6 inline-flex">
                            <div className="grow shrink basis-0 h-6 justify-start items-center gap-1 flex">
                                <div className="w-6 h-6 relative top-1">
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="1" y="1" width="16" height="16" rx="8" stroke="#F2994A" stroke-width="2"/>
                                    <path d="M8.39158 3.60315V4.297C7.0293 4.55051 6 5.6302 6 6.92151C6 7.8083 6.49641 8.99076 8.85177 9.58816C10.1352 9.91388 10.7893 10.4146 10.7893 11.0784C10.7893 11.893 9.99005 12.5565 9.00305 12.5565C8.01604 12.5565 7.21684 11.893 7.21684 11.0784C7.21684 10.7466 6.94444 10.4752 6.61147 10.4752C6.2785 10.4752 6.0061 10.7466 6.0061 11.0784C6.0061 12.3695 7.0354 13.4554 8.39768 13.7029V14.3968C8.39768 14.7286 8.67008 15 9.00305 15C9.33602 15 9.60842 14.7286 9.60842 14.3968V13.7029C10.9707 13.4494 12 12.3697 12 11.0784C12 10.1916 11.5036 9.00918 9.14823 8.41785C7.86477 8.09213 7.21074 7.59143 7.21074 6.92157C7.21074 6.10698 8.00995 5.44345 8.99695 5.44345C9.98396 5.44345 10.7832 6.10704 10.7832 6.92157C10.7832 7.25335 11.0556 7.52479 11.3885 7.52479C11.7215 7.52479 11.9939 7.25335 11.9939 6.92157C11.9939 5.63052 10.9646 4.54457 9.60232 4.29706V3.60322C9.60232 3.27144 9.32992 3 8.99695 3C8.66398 2.99975 8.39158 3.26538 8.39158 3.60322V3.60315Z" fill="#F2994A" stroke="#F2994A" stroke-width="0.5"/>
                                    </svg>
                                </div>
                                 
                                {job.compensation_type == 'MONTHLY_SALARY' && <div className="text-[#4b4b61] text-sm font-medium leading-tight">
                                    {job.compensation_amount} KD / {t("month")}
                                </div>}

                                {job.compensation_type == 'HOURLY' && <div className="text-[#4b4b61] text-sm font-medium leading-tight">
                                    {job.compensation_amount} KD / {t("hour")}
                                </div>}

                                {job.compensation_type == 'FIXED_PRICE' && <div className="text-[#4b4b61] text-sm font-medium leading-tight">
                                    {job.compensation_amount} KD
                                </div>}
                            </div>
                        </div>

                        {job.area && <div className="self-stretch justify-start items-center gap-1 inline-flex">
                            <div className="w-6 h-6 relative start-[-4px]">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 8.00269C10.8954 8.00269 9.99998 8.89794 9.99998 10.0023C9.99998 11.1066 10.8954 12.0019 12 12.0019C13.1045 12.0019 14 11.1066 14 10.0023C14 8.89794 13.1045 8.00269 12 8.00269Z" fill="#23233D" />
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M8.49998 17.4697C9.20083 18.306 9.94688 19.1029 10.7346 19.8567C11.4446 20.5361 12.5554 20.5361 13.2654 19.8567C14.0531 19.1029 14.7991 18.306 15.4999 17.4697C17.0999 15.5591 19 12.7137 19 10.0023C19.0058 8.14504 18.2684 6.36263 16.9519 5.05229C14.95 3.04894 11.9379 2.44923 9.32105 3.533C6.70424 4.61677 4.99858 7.1704 5 10.0023C5 12.7137 6.89999 15.5591 8.49998 17.4697ZM6.99999 10.0023C7.0033 7.24278 9.23993 5.0066 12 5.0033C14.76 5.0066 16.9966 7.24278 16.9999 10.0023C16.9999 11.167 16.4729 13.1856 13.966 16.19C13.555 16.6793 13.1276 17.1543 12.6844 17.6143C12.3096 18.0032 11.6905 18.0031 11.316 17.6138C10.8729 17.153 10.4456 16.6772 10.035 16.187C7.52699 13.1866 6.99999 11.168 6.99999 10.0023Z" fill="#23233D" />
                                </svg>
                            </div>
                            <div className="grow shrink basis-0 text-[#4b4b61] text-sm font-medium leading-tight">
                                {langContent(job.area.area_name_en, job.area.area_name_ar)}
                            </div>
                        </div>}

                        {(job.hours_per_day || job.days_per_week) && <div className="self-stretch justify-start items-center gap-6 inline-flex">
                            <div className="grow shrink basis-0 h-6 justify-start items-start gap-1 flex">
                                <div className="w-6 h-6 relative">
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="1" y="1" width="16" height="16" rx="8" stroke="#23233D" stroke-width="2" />
                                        <path d="M8 6V8.34252C8 8.66548 8.15597 8.96855 8.41876 9.15626L11 11" stroke="#23233D" stroke-width="2" stroke-linecap="round" />
                                    </svg>
                                </div>
                                <div className="text-[#4b4b61] text-sm font-medium leading-tight">
                                    {job.hours_per_day && <>{job.hours_per_day} {t('hours per day')}</>}
                                    {job.hours_per_day && job.days_per_week && <>&nbsp;|&nbsp;</>}
                                    {job.days_per_week && <>{job.days_per_week} {t('days per week')}</>}
                                </div>
                            </div>
                        </div>}

                        {(job.available_from || job.available_to) && <div className="self-stretch justify-start items-center gap-6 inline-flex">
                            <div className="grow shrink basis-0 h-6 justify-start items-start gap-1 flex">
                                <div className="w-6 h-6 relative">
                                    <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="1" y="3" width="14" height="14" rx="4" stroke="#23233D" stroke-width="2" />
                                        <path d="M15 8H1" stroke="#23233D" stroke-width="2" />
                                        <rect x="4" width="2" height="6" rx="1" fill="#23233D" />
                                        <rect x="10" width="2" height="6" rx="1" fill="#23233D" />
                                    </svg>
                                </div>

                                {!job.available_from && job.available_to && <div className="text-[#4b4b61] text-sm font-medium leading-tight">
                                    {t("txt_available_to", {
                                        value: dateTimeFormat(job.available_to, 'dd MMMM')
                                    })}
                                </div>}

                                {job.available_from && !job.available_to && <div className="text-[#4b4b61] text-sm font-medium leading-tight">
                                    {t("txt_available_from", {
                                        value: dateTimeFormat(job.available_from, 'dd MMMM')
                                    })}
                                </div>}

                                {job.available_from && job.available_to && <div className="text-[#4b4b61] text-sm font-medium leading-tight">
                                    {t("txt_available_from_to", {
                                        from: dateTimeFormat(job.available_from, 'dd MMMM'),
                                        to: dateTimeFormat(job.available_to, 'dd MMMM')
                                    })}
                                </div>
                                }

                            </div>
                        </div>}
                    </div>

                    {job.jobSkills && job.jobSkills.length > 0 && <div className="my-2.5 w-full bg-white rounded-lg shadow-[0px_2px_4px_0px_rgba(0,0,0,0.10)] flex-col justify-start items-start inline-flex overflow-hidden p-4 pb-1.5 gap-4">
                        <div className="h-6 justify-start items-center gap-1 flex text-[#22223d] text-lg font-bold leading-normal">
                            {t("Requirements")}
                        </div>

                        <div className="self-stretch justify-start items-center gap-2 block">
                            {job.jobSkills.map((jobSkill: JobSkills) => (<div className="px-3 py-1.5 bg-[#f5f5f7] rounded-lg justify-center items-center me-2.5 mb-2.5 gap-2.5 inline-block">
                                <div className="text-[#68687a] text-sm font-semibold leading-tight">
                                    {langContent(jobSkill.skill, jobSkill.skill_ar)}
                                </div>
                            </div>))}
                        </div>
                    </div>}

                    {job.description && <div className="my-2.5 w-full bg-white rounded-lg shadow-[0px_2px_4px_0px_rgba(0,0,0,0.10)] flex-col justify-start items-start inline-flex overflow-hidden p-4 gap-4">
                        <div className="h-6 justify-start items-center flex text-[#22223d] text-lg font-bold leading-normal">
                            {t("Description")}
                        </div>

                        <p>
                            {langContent(job.description, job.description_ar)}
                        </p>

                    </div>}

                    {showApply && <Apply seen_at={seen_at} job={job}
                        onClose={(data) => onApplyClose(data)}></Apply>}
                </div>
            </>}
        </Suspense>
    )
}