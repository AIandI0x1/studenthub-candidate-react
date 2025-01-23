import { Job } from "@/models/job";
import JobSkills from "@/models/job-skills";
import { useTimeAgo } from "@/utils/app";
import { useTranslation } from "react-i18next";
import { dateTimeFormat, langContent } from "@/utils/common";

import { Link } from "react-router-dom";

interface IJobComponent {
    job: Job;
}

export default function JobComponent({ job }: IJobComponent) {

    const { t } = useTranslation();

    const {timeAgo} = useTimeAgo(job.created_at, t);

    return (
        <Link to={`/jobs/${job.job_uuid}`}>
        <div className="w-full mb-2.5  bg-white rounded-lg shadow-[0px_2px_4px_0px_rgba(0,0,0,0.10)] flex-col justify-start items-start inline-flex">
            <div className="self-stretch p-4 bg-white shadow-[inset_0px_-1px_0px_0px_rgba(226,226,230,1.00)] flex-col justify-start items-start gap-4 flex">
                <div className="self-stretch justify-start items-center gap-1 inline-flex">
                    <div className="grow shrink basis-0 h-6 justify-start items-center gap-1 flex">
                        <div className="grow shrink basis-0 text-[#22223d] text-lg font-bold leading-normal">
                            { langContent(job.position, job.position_ar) }</div>
                    </div>
                    
                    { job.jobInterest && <div className="px-3 py-1.5 bg-[#f5f5f7] rounded-lg justify-center items-center gap-2.5 flex">
                        <div className="text-[#219653]  text-sm font-medium leading-tight">
                            { t('Applied') }
                        </div>
                    </div> }

                    { job.status == 1 && !job.is_available && <div className="px-3 py-1.5 bg-[#f5f5f7] rounded-lg justify-center items-center gap-2.5 flex">
                        <div className="text-[#68687a]  text-sm font-medium leading-tight">
                            { t('No Longer Available') }
                        </div>
                    </div> }

                    { /*job.is_available */}
                    <div className="px-3 py-1.5 bg-[#f5f5f7] rounded-lg justify-center items-center gap-2.5 flex">
                        
                        { job.is_available && job.status == 1 && <div className="text-[#68687a] text-sm font-medium leading-tight">
                            { timeAgo }
                        </div> }

                        { job.is_available && job.status == 2 && <div className="text-[#68687a] text-sm font-medium leading-tight">
                        { t("Closed") }
                        </div> }

                        { job.is_available && job.status == 10 && <div className="text-[#68687a] text-sm font-medium leading-tight">
                        { t("Draft") }
                        </div> }
                    </div>

                </div>

                { job.description && <div className="self-stretch text-[#22223d] text-sm font-normal leading-tight">
                    { langContent(job.description, job.description_ar) }
                </div> }
                
                {job.jobSkills && job.jobSkills.length > 0 && <div className="self-stretch justify-start items-center gap-2 block">
                    { job.jobSkills.map((jobSkill: JobSkills) => <div className="px-3 py-1.5 bg-[#f5f5f7] rounded-lg justify-center items-center me-2.5 mb-2.5 gap-2.5 inline-block">
                        <div className="text-[#68687a] text-sm font-semibold leading-tight">
                            { langContent(jobSkill.skill, jobSkill.skill_ar) }
                        </div>
                    </div> )}
                </div> }

                { job.gender && <div className="self-stretch justify-center items-center gap-2.5 inline-flex">
                    
                    <div className="w-6 h-6 relative -top-1">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 21V19C19 17.9391 18.5786 16.9217 17.8284 16.1716C17.0783 15.4214 16.0609 15 15 15H9C7.93913 15 6.92172 15.4214 6.17157 16.1716C5.42143 16.9217 5 17.9391 5 19V21" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <div className="relative top-[-3px] grow shrink basis-0 text-[#22223d] text-sm font-medium leading-tight">
                        { job.gender == 1 && t('Male') } 
                        { job.gender == 2 && t('Female') } 
                        { job.gender == 3 && t('Other') } 
                        { job.gender == 4 && t('Any') } 
                    </div>
                </div> }

                { (job.available_from || job.available_to) && <div className="self-stretch justify-center items-center gap-2.5 inline-flex">
                    
                    <div className="w-6 h-6 relative">
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="1" y="1" width="16" height="16" rx="8" stroke="#23233D" strokeWidth="2"/>
                        <path d="M8 6V8.34252C8 8.66548 8.15597 8.96855 8.41876 9.15626L11 11" stroke="#23233D" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </div>
                    
                    { job.available_from && job.available_to && <div className="relative top-[-3px] grow shrink basis-0 text-[#22223d] text-sm font-medium leading-tight">
                        { t("txt_available_from_to", { 
                            from: dateTimeFormat(job.available_from, 'dd MMMM'), 
                            to: dateTimeFormat(job.available_to, 'dd MMMM') 
                        })
                        } 
                    </div> }
                    
                    { job.available_from && !job.available_to && <div className="relative top-[-3px] grow shrink basis-0 text-[#22223d] text-sm font-medium leading-tight">
                        { t("txt_available_from", { 
                            value: dateTimeFormat(job.available_from, 'dd MMMM')
                        })} 
                    </div> }
                
                    { !job.available_from && job.available_to && <div className="relative top-[-3px] grow shrink basis-0 text-[#22223d] text-sm font-medium leading-tight">
                        { t("txt_available_to", { 
                            value: dateTimeFormat(job.available_to, 'dd MMMM')
                        })
                        } 
                    </div> }
                </div> }
            </div>

            <div className="self-stretch h-12 p-3 flex-col justify-center items-start gap-[18px] flex">
                <div className="self-stretch justify-start items-center gap-6 inline-flex">
                    <div className="justify-start items-center gap-1 flex">
                        
                        <div className="w-6 h-6 relative start-[4px] top-[3px]">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="1" y="1" width="16" height="16" rx="8" stroke="#F2994A" strokeWidth="2"/>
                            <path d="M8.39158 3.60315V4.297C7.0293 4.55051 6 5.6302 6 6.92151C6 7.8083 6.49641 8.99076 8.85177 9.58816C10.1352 9.91388 10.7893 10.4146 10.7893 11.0784C10.7893 11.893 9.99005 12.5565 9.00305 12.5565C8.01604 12.5565 7.21684 11.893 7.21684 11.0784C7.21684 10.7466 6.94444 10.4752 6.61147 10.4752C6.2785 10.4752 6.0061 10.7466 6.0061 11.0784C6.0061 12.3695 7.0354 13.4554 8.39768 13.7029V14.3968C8.39768 14.7286 8.67008 15 9.00305 15C9.33602 15 9.60842 14.7286 9.60842 14.3968V13.7029C10.9707 13.4494 12 12.3697 12 11.0784C12 10.1916 11.5036 9.00918 9.14823 8.41785C7.86477 8.09213 7.21074 7.59143 7.21074 6.92157C7.21074 6.10698 8.00995 5.44345 8.99695 5.44345C9.98396 5.44345 10.7832 6.10704 10.7832 6.92157C10.7832 7.25335 11.0556 7.52479 11.3885 7.52479C11.7215 7.52479 11.9939 7.25335 11.9939 6.92157C11.9939 5.63052 10.9646 4.54457 9.60232 4.29706V3.60322C9.60232 3.27144 9.32992 3 8.99695 3C8.66398 2.99975 8.39158 3.26538 8.39158 3.60322V3.60315Z" fill="#F2994A" stroke="#F2994A" strokeWidth="0.5"/>
                            </svg>
                        </div>
                        
                        { job.compensation_type == 'MONTHLY_SALARY' && <div className="text-[#4b4b61] text-sm font-medium leading-tight">
                            { job.compensation_amount } KD / { t("month") }
                        </div> }

                        { job.compensation_type == 'HOURLY' && <div className="text-[#4b4b61] text-sm font-medium leading-tight">
                            { job.compensation_amount } KD / { t("hour") }
                        </div> }

                        { job.compensation_type == 'FIXED_PRICE' && <div className="text-[#4b4b61] text-sm font-medium leading-tight">
                            { job.compensation_amount } KD 
                        </div> }
                    </div>
                    { job.area && <div className="justify-start items-center gap-1 flex">
                            
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 8.00269C10.8954 8.00269 9.99998 8.89794 9.99998 10.0023C9.99998 11.1066 10.8954 12.0019 12 12.0019C13.1045 12.0019 14 11.1066 14 10.0023C14 8.89794 13.1045 8.00269 12 8.00269Z" fill="#23233D"/>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M8.49998 17.4697C9.20083 18.306 9.94688 19.1029 10.7346 19.8567C11.4446 20.5361 12.5554 20.5361 13.2654 19.8567C14.0531 19.1029 14.7991 18.306 15.4999 17.4697C17.0999 15.5591 19 12.7137 19 10.0023C19.0058 8.14504 18.2684 6.36263 16.9519 5.05229C14.95 3.04894 11.9379 2.44923 9.32105 3.533C6.70424 4.61677 4.99858 7.1704 5 10.0023C5 12.7137 6.89999 15.5591 8.49998 17.4697ZM6.99999 10.0023C7.0033 7.24278 9.23993 5.0066 12 5.0033C14.76 5.0066 16.9966 7.24278 16.9999 10.0023C16.9999 11.167 16.4729 13.1856 13.966 16.19C13.555 16.6793 13.1276 17.1543 12.6844 17.6143C12.3096 18.0032 11.6905 18.0031 11.316 17.6138C10.8729 17.153 10.4456 16.6772 10.035 16.187C7.52699 13.1866 6.99999 11.168 6.99999 10.0023Z" fill="#23233D"/>
                        </svg>

                        <div className="text-[#4b4b61] text-sm font-medium leading-tight">
                            { langContent(job.area.area_name_en, job.area.area_name_ar)}
                        </div>
                    </div> }
                </div>
            </div>

        </div>
        </Link>
    );
}