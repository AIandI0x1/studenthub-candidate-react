import { CandidateExperience } from "@/models/candidate.experience";
import { useTranslation } from "react-i18next";


export function Experience({ experience }: { experience: CandidateExperience }) {
    const { t } = useTranslation();

    return (
        <div className="w-full p-4 bg-white rounded-lg shadow flex-col justify-start items-start gap-2 inline-flex  mb-4">
            <div className="self-stretch flex-col justify-start items-start gap-2 flex">
                <div className="self-stretch text-[#0f0f2c] text-base font-semibold leading-normal">
                    {experience.experience}
                </div>
                <div className="self-stretch justify-start items-center gap-4 inline-flex">
                    { experience.employer && <div className="grow shrink basis-0 text-[#4b4b61] text-sm font-normal leading-tight">
                        { experience.employer }
                    </div> }
                    { experience.start_year && 
                    <div className="grow shrink basis-0 text-end text-[#4b4b61] text-xs font-normal leading-none">
                        { experience.start_year } - { experience.end_year? experience.end_year: t('now')}
                    </div>
                    }
                </div>
            </div>
        </div>
    );
}