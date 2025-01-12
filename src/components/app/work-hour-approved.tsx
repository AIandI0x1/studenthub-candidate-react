// components/App/WorkHourApproved.jsx

import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next'; // Assuming you're using react-i18next for translations
import { format } from 'date-fns';
import { dateTimeFormat } from '@/utils/common';

const WorkHourApproved = ({ candidateNotification, onClick }: { candidateNotification: any, onClick: any }) => {
    const { t } = useTranslation();
    const [isNew, setIsNew] = React.useState(candidateNotification.is_new);

    return (
        
        <div  className={ `${isNew? 'cursor-pointer': ''} ion-card rounded-lg shadow-md bg-white relative`} onClick={() => onClick() && setIsNew(false)}>
            <div className="ion-card-content p-4 flex flex-col">
                <h5 className="text-gray-900 font-semibold text-lg">{t("Work Hour Approved")}</h5>
                <p className="txt-meta text-gray-500 text-sm">
                    
                </p>
                {candidateNotification.store && (
                    <p className="txt-meta text-gray-500 text-sm">
                        {t("txt_worked_at", {
                            store: candidateNotification.store.store_name
                        })}
                    </p>
                )}
                <p className="txt-detail text-gray-900 text-base">
                    {t("txt_hours_approved_on", {
                        on: dateTimeFormat(candidateNotification.created_at || '', 'MMM d')
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

WorkHourApproved.propTypes = {
    candidateNotification: PropTypes.shape({
        created_at: PropTypes.string.isRequired,
        candidateWorkLogFeedback: PropTypes.shape({
            createdBy: PropTypes.shape({
                contact_name: PropTypes.string,
            }).isRequired,
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

export default WorkHourApproved;
