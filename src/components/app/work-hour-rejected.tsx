// components/App/WorkHourRejected.jsx

import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next'; // Assuming you're using react-i18next for translations
import { format } from 'date-fns';
import { dateTimeFormat } from '@/utils/common';

const WorkHourRejected = ({ candidateNotification, onClick }: { candidateNotification: any, onClick: any }) => {
    const { t } = useTranslation();
    const [isNew, setIsNew] = React.useState(candidateNotification.is_new);

    return (
        <div onClick={() => onClick() && setIsNew(false)} className={`ion-card rounded-lg shadow-md bg-white relative`}>
            <div className="ion-card-content p-4 flex flex-col">
                <h5 className="text-gray-900 font-semibold text-lg">{t("Work Hour Rejected")}</h5>
                <p className="txt-meta text-gray-500 text-sm">
                    {t("txt_reject_by", {
                        by: candidateNotification.candidateWorkLogFeedback.createdBy.contact_name || "employer",
                        on: dateTimeFormat(candidateNotification.created_at, 'MMM d')
                        //new Date(candidateNotification.created_at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
                    })}
                </p>
                {candidateNotification.store && (
                    <p className="txt-meta text-gray-500 text-sm">
                        {t("txt_worked_at", {
                            store: candidateNotification.store.store_name
                        })}
                    </p>
                )}
                <p className="txt-detail text-gray-900 text-base">
                    {t("txt_hours_rejected_on", {
                        day: dateTimeFormat(candidateNotification.created_at, 'MMM d')
                        //new Date(candidateNotification.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
                    })}
                </p>
                <p className="txt-meta text-gray-500 text-sm">
                    {t("txt_hours_rejection_reason", {
                        by: candidateNotification.candidateWorkLogFeedback.createdBy.contact_name || "employer",
                        reason: candidateNotification.candidateWorkLogFeedback.reason
                    })}
                </p>

                {/* Uncomment this section if needed */}
                {/* <div className="health-indicator">
                    <h5 className="txt-total-hours">{t("Total Hours")}</h5>
                    <ul className="flex gap-2">
                        {candidateNotification.candidateWorkingDate.total_pending > 0 && (
                            <li className="pending">{candidateNotification.candidateWorkingDate.total_pending}</li>
                        )}
                        {candidateNotification.candidateWorkingDate.total_approved > 0 && (
                            <li className="approved">{candidateNotification.candidateWorkingDate.total_approved}</li>
                        )}
                        {candidateNotification.candidateWorkingDate.total_rejected > 0 && (
                            <li className="rejected">{candidateNotification.candidateWorkingDate.total_rejected}</li>
                        )}
                    </ul>
                    <div className="time-wrapper flex flex-col">
                        <b>
                            {candidateNotification.candidateWorkingDate.total_time
                                ? secondsToTime(candidateNotification.candidateWorkingDate.total_time)
                                : "00:00"}
                        </b>
                        <span>
                            {new Date(candidateNotification.candidateWorkingDate.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                            <MoveRight />
                            {candidateNotification.candidateWorkingDate.end_time
                                ? new Date(candidateNotification.candidateWorkingDate.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                : t("Now")}
                        </span>
                    </div>
                </div> */}

                {isNew && (
                    <span className="w-3.5 h-3.5 bg-blue-600 rounded-full absolute top-3 end-4"></span>
                )}
            </div>
                    
        </div>
    );
};

WorkHourRejected.propTypes = {
    candidateNotification: PropTypes.shape({
        created_at: PropTypes.string.isRequired,
        candidateWorkLogFeedback: PropTypes.shape({
            createdBy: PropTypes.shape({
                contact_name: PropTypes.string,
            }).isRequired,
            reason: PropTypes.string.isRequired,
        }).isRequired,
        store: PropTypes.shape({
            store_name: PropTypes.string,
        }),
        candidateWorkingDate: PropTypes.shape({
            total_pending: PropTypes.number,
            total_approved: PropTypes.number,
            total_rejected: PropTypes.number,
            total_time: PropTypes.number,
            start_time: PropTypes.string,
            end_time: PropTypes.string,
        }),
    }).isRequired,
};

export default WorkHourRejected;
 