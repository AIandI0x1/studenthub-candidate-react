// components/App/InvitationNotification.jsx

import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next'; // Assuming you're using react-i18next for translations
import { CandidateNotification } from '@/models/candidate-notification';
import { dateTimeFormat } from '@/utils/common';

const InvitationNotification = ({ candidateNotification, onClick }: { candidateNotification: CandidateNotification, onClick: any }) => {
    const { t, i18n } = useTranslation();
    const [isNew, setIsNew] = React.useState(candidateNotification.is_new);

    return (
        <div onClick={() => onClick() && setIsNew(false)} className={ `${isNew? 'cursor-pointer': ''} card p-3 flex flex-col gap-1 rounded-lg bg-white shadow-md relative` }>
            <h5 className="text-gray-900 font-semibold text-lg leading-7 m-0">
                {t("New Part-Time Invitation")}
            </h5>
            <p className="text-gray-600 text-sm leading-4 m-0">
                {t("txt_invitated_for", {
                    company: i18n.language == "en"?
                        candidateNotification.company?.company_common_name_en :
                        candidateNotification.company?.company_common_name_ar,
                    position: candidateNotification.invitation?.request && 
                    candidateNotification.invitation.request.request_position_title
                        ? candidateNotification.invitation.request.request_position_title
                        : t("Part-timer")
                })}
            </p>
            <p className="txt-time text-end text-gray-500 text-xs leading-4 m-0">
                { candidateNotification.created_at ? 
                    dateTimeFormat(candidateNotification.created_at, 'MMM d') : ''   
                }
            </p>
            
            {isNew && (
                <span className="unread w-3.5 h-3.5 bg-blue-500 absolute top-3 end-4 rounded-full"></span>
            )}
        </div>
    );
};

InvitationNotification.propTypes = {
    candidateNotification: PropTypes.shape({
        company: PropTypes.shape({
            company_common_name_en: PropTypes.string.isRequired,
            company_common_name_ar: PropTypes.string.isRequired,
        }).isRequired,
        invitation: PropTypes.shape({
            request: PropTypes.shape({
                request_position_title: PropTypes.string,
            }),
        }).isRequired,
        created_at: PropTypes.string.isRequired,
        is_new: PropTypes.bool.isRequired,
    }).isRequired,
};

export default InvitationNotification;

// Tailwind CSS styles are applied directly in the component