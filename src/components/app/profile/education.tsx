import { CandidateEducation } from "@/models/candidate-education";
import { useTranslation } from "react-i18next";

export function Education({ education }: { education: CandidateEducation }) {
    const { i18n } = useTranslation();

    return (
        <div className="w-full p-4 bg-white rounded-lg shadow flex-col justify-start items-start gap-2 inline-flex  mb-4">
            <div className="self-stretch flex-col justify-start items-start gap-2 flex">
                { education.degree && <div className="self-stretch text-[#0f0f2c] text-base font-semibold leading-normal">
                    { i18n.language == 'ar' && education.degree.degree_name_ar? education.degree.degree_name_ar: education.degree.degree_name_en }
                </div> }
                
                { education.major && <div className="self-stretch text-[#4b4b61] text-sm font-normal leading-tight">
                        { i18n.language == 'ar' && education.major.major_name_ar? education.major.major_name_ar: education.major.major_name_en }
                    </div> }
                    
                { education.custom_major && <div className="self-stretch text-[#4b4b61] text-sm font-normal leading-tight">
                    { education.custom_major }
                </div> }
                    
                <div className="self-stretch h-5 justify-start items-center gap-4 inline-flex">
                   
                    { education.university && <div className="grow shrink basis-0 text-[#4b4b61] text-sm font-normal leading-tight">
                        { i18n.language == 'ar' && education.university.university_name_ar? education.university.university_name_ar: education.university.university_name_en }
                    </div> }
                    
                    { education.education_type !== "standard" && education.custom_institution_name && <div className="grow shrink basis-0 text-[#4b4b61] text-sm font-normal leading-tight">
                        { education.custom_institution_name }
                    </div> }

                    { education.graduation_year && 
                    <div className="grow shrink basis-0 text-end text-[#4b4b61] text-xs font-normal leading-none">
                        { education.graduation_year }
                    </div>
                    }
                </div>
            </div>
        </div>
    );
}