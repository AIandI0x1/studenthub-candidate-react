import { CandidateWorkHistory } from "@/models/candidate-work-history";
import { dateTimeFormat } from "@/utils/common";
import { useTranslation } from "react-i18next";

export function AssignmentDetail({ history }: { history: CandidateWorkHistory }) {

    const { t } = useTranslation();

    return (<div className="w-full flex-col justify-start items-start gap-6 inline-flex">
        <div className="text-[#22223d] text-lg font-semibold leading-7">
            {t('Assignment Details')}
        </div>

        <div className="self-stretch h-12 flex-col justify-start items-start gap-4 flex">
            <div className="self-stretch h-12 flex-col justify-start items-start gap-1 flex">
                <div className="self-stretch text-[#4b4b61] text-sm font-medium leading-tight">
                    {t('Employer')}
                </div>
                <div className="text-[#22223d] text-base font-semibold leading-normal">
                    { history.company.company_name }
                </div>
            </div>
        </div>
        <div className="self-stretch h-12 flex-col justify-start items-start gap-4 flex">
            <div className="self-stretch h-12 flex-col justify-start items-start gap-1 flex">
                <div className="self-stretch text-[#4b4b61] text-sm font-medium leading-tight">
                    {t('Compensation')}
                </div>
                
                <div className="self-stretch text-[#22223d] text-base font-semibold leading-normal">
                    { !history.contract && <>{history.candidate_hourly_rate} KD/hr</> }
                    { history.contract && history.contract.amount &&     
                        <>
                            { history.contract.type == 'HOURLY' && 
                                <> { history.contract.amount.candidate_hourly_rate } { history.contract.currency_code }/hr </> 
                            }

                            { history.contract.type == 'FIXED_PRICE' && 
                                <> { history.contract.amount.candidate_total } { history.contract.currency_code } </> 
                            }

                            { history.contract.type == 'MONTHLY_SALARY' && 
                                <> { history.contract.amount.candidate_total } { history.contract.currency_code } /{t('month')}</> 
                            }
                        </> }
                </div> 
            </div>
        </div>

        <div className="self-stretch h-12 flex-col justify-start items-start gap-4 flex">
            <div className="self-stretch h-12 flex-col justify-start items-start gap-1 flex">
                <div className="self-stretch text-[#4b4b61] text-sm font-medium leading-tight">
                    {t('Start Date')}
                </div>
                <div className="self-stretch text-[#22223d] text-base font-semibold leading-normal">
                    {dateTimeFormat(history.start_date, 'MMM d, yyyy')} 
                </div>
            </div>
        </div>



    </div>);
}