// components/App/WorkLog.jsx

import { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next'; // Assuming you're using react-i18next for translations
import { dateTimeFormat, secondsToTime } from '@/utils/common';
import i18n from '@/18n';
import { Button } from '../ui/button';
import WorkLogAppealPage from '../modals/work-log-appeal/page';
import { Link } from 'react-router-dom';

const WorkLog = ({ hour, onAppealClose }: { hour: any, onAppealClose: any | undefined }) => {
    const { t } = useTranslation();
    const [modalAppealIsOpen, setModalAppealIsOpen] = useState(false);
     
    return (
        <>

            <div className="cursor-pointer w-full p-4 bg-white rounded-lg shadow flex-col justify-center items-start gap-1.5 inline-flex mb-4">
                <div className="self-stretch justify-start items-start gap-1 inline-flex">
                    <div className="grow shrink basis-0 text-[#22223d] text-base font-medium leading-normal">
                        {hour.end_time ? secondsToTime(hour.total_time) : t("On-Going")}
                    </div>
            
                    {hour.end_time && (
                        <>
                        {hour.status === 0 && <div className="px-1.5 py-0.5 bg-[#fff7ef] rounded-md justify-start items-start gap-2.5 flex">
                            <div className="text-end text-[#CA7F3E] text-sm font-medium leading-tight">{t("Pending")}</div> 
                        </div>}

                        {hour.status === 1 && <div className="h-6 px-1.5 py-0.5 bg-[#edfcf3] rounded-md justify-start items-start gap-2.5 inline-flex">
                            <div className="text-end text-[#28b563] text-sm font-medium leading-tight">{t("Approved")}</div>
                        </div> }

                        {hour.status === 2 && <div className="h-6 px-1.5 py-0.5 bg-[#fff2f2] rounded-md justify-start items-start gap-2.5 inline-flex">
                            <div className="text-end text-[#eb5757] text-sm font-medium leading-tight">{t("Rejected")}</div>
                        </div> } 
                        </> )}

                </div>
                <div className="self-stretch justify-start items-center gap-1 inline-flex">
                    <div className="justify-end items-center gap-2 flex">
                        <div className="text-[#4b4b61] text-sm font-normal leading-tight">
                        {dateTimeFormat(hour.start_time || '', 'hh:mm a')} 
                        </div>
                        <span className={ i18n.language == 'ar'? "inline-block rotate-180 me-2": 'mx-2' }>→</span>
                        { /*<ArrowRight className='inline mx-2 w-6 h-6 relative'  /> */}
                        <div className="text-[#4b4b61] text-sm font-normal leading-tight">
                        {hour.end_time 
                                ? dateTimeFormat(hour.start_time || '', 'hh:mm a') 
                                : t("Now")}
                        </div>
                    </div>
                </div>
                <div className="self-stretch justify-between items-center inline-flex">
                    <div className="h-5 justify-start items-center gap-2 flex">
                        <div className="text-[#22223d] text-sm font-medium leading-tight">{t("Tracking Method")}:</div>
                    </div>
                    <div className="justify-end items-center gap-2 flex">
                        <div className="text-[#22223d] text-sm font-normal leading-tight">{t(hour.via)}</div>
                    </div>
                </div>
            </div>
            
            { hour.status === 2 && hour.candidateWorkLogFeedback && <div className={`p-3 flex flex-col gap-1 rounded-lg bg-white shadow-md relative`}>
                <h5 className="text-gray-900 font-semibold text-lg leading-7 m-0">
                    {t("Work Session Rejected")}
                </h5>
                
                <div className=" text-[#7d7d8d] text-xs font-normal leading-none">
                    {t("txt_rejected_on", { 
                        value:  dateTimeFormat(hour.candidateWorkLogFeedback.created_at, 'eee, d MMM'),
                    })}
                    &nbsp;|&nbsp; 
                    {dateTimeFormat(hour.start_time || '', 'hh:mm a')} 
                    &nbsp;{t("to")}&nbsp;
                    {dateTimeFormat(hour.end_time || '', 'hh:mm a') }
                </div>

                { hour.candidateWorkLogFeedback.store && <div className=" text-[#7d7d8d] text-xs font-normal leading-none">
                    {t("txt_worked_at_as", {
                        store: hour.candidateWorkLogFeedback.store.store_name,
                        position: t("Part-timer"),
                    })}
                </div> }

                { hour.candidateWorkLogFeedback.reason && <div className="border-slate-200 border-b my-1.5 pb-1.5">
                    <span className="text-[#4b4b61] text-sm font-semibold leading-tight">
                        {t('Reason')}:&nbsp;
                    </span>
                    <span className="text-[#4b4b61] text-sm font-normal leading-tight"> 
                        {hour.candidateWorkLogFeedback.reason}
                    </span>
                </div> }

                { hour.candidateWorkingHourAppeal && <>
                <div className="flex-col justify-start items-start gap-1.5 inline-flex my-1.5">
                    <div className="">
                        <span className="text-[#4b4b61] text-sm font-semibold leading-tight">
                            {t('Appeal Submitted by You')}:&nbsp;
                        </span>
                        <span className="text-[#4b4b61] text-sm font-normal leading-tight"> 
                            {hour.candidateWorkingHourAppeal.reason}
                        </span>
                    </div>
                    <div className=" text-[#7d7d8d] text-xs font-normal leading-none">
                        {hour.candidateWorkingHourAppeal.status == 10 && 
                            t('Appeal received. Our team will review your case and mediate with the employer.') }

                        {hour.candidateWorkingHourAppeal.status == 1 && 
                            t('Your appeal has been sent. We will start working on the appeal as soon as the appeal has been reviewed.') }

                        {hour.candidateWorkingHourAppeal.status == 2 &&     
                            t('Your appeal has been reviewed. We are currently working on it and will update you on any decisions made regarding your appeal.') }
                        
                        {hour.candidateWorkingHourAppeal.status == 3 &&   
                            t('Your appeal has been resolved. We appreciate you reaching out to us and hope that we were able to address your concerns satisfactorily.') }
                            
                    </div>
                </div>
                
                <Link to={ "/work-log/appeal/" + hour.candidateWorkingHourAppeal.appeal_uuid }>
                    <Button className="h-10 bg-[#4c6ff2] xs:w-full sm:w-[240px]">
                        {t('View Appeal Details')}
                    </Button>
                </Link>
                </>}

                { !hour.candidateWorkingHourAppeal && <>    
                <div className=" text-[#7d7d8d] text-xs font-normal leading-none my-1.5 ">
                    {t('If you think this rejection is wrong or have more information, you can appeal. Our team will review your case and mediate with the employer.')}
                </div>

                <Button className="h-10 bg-[#4c6ff2] xs:w-full sm:w-[240px]" onClick={() => setModalAppealIsOpen(true)}>
                    {t('Submit an Appeal')}
                </Button>
                </>}
            </div>
            }

            { modalAppealIsOpen && <WorkLogAppealPage onClose={() => { setModalAppealIsOpen(false); onAppealClose({ 'refresh': true});} } 
                candidate_working_hour_uuid={hour.candidate_working_hour_uuid} /> }

        </> 
    );
};

WorkLog.propTypes = {
    hour: PropTypes.shape({
        end_time: PropTypes.string,
        total_time: PropTypes.number.isRequired,
        start_time: PropTypes.string.isRequired,
        status: PropTypes.number.isRequired,
        via: PropTypes.string.isRequired,
    }).isRequired,
};

export default WorkLog;
