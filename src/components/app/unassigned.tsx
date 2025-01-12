// components/App/Unassigned.jsx

import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next'; // Assuming you're using react-i18next for translations
import { dateTimeFormat } from '@/utils/common';

const Unassigned = ({ candidateNotification, onClick }: { candidateNotification: any, onClick: any }) => {
    const { t } = useTranslation();
    const [isNew, setIsNew] = React.useState(candidateNotification.is_new);

    return (
        <div onClick={() => onClick() && setIsNew(false)} className={ `${isNew? 'cursor-pointer': ''} ion-card rounded-lg shadow-md bg-white relative`}>
            <div className="ion-card-content p-4 flex flex-col">
                {candidateNotification.store && (
                    <h5 className="text-gray-900 font-semibold text-lg">
                        {t("txt_unassigned_from", { store: candidateNotification.store.store_name })}
                    </h5>
                )}
                <p className="txt-meta text-gray-500 text-sm">
                    {t("txt_unassigned_on", {
                        on: dateTimeFormat(candidateNotification.created_at, 'MMM d, yyyy')
                        //new Date(candidateNotification.created_at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
                    })}
                </p>
                {candidateNotification.store && (
                    <p className="txt-detail text-gray-900 text-base">
                        {t("txt_no_longer_working_for", { store: candidateNotification.store.store_name })}
                    </p>
                )}
                <p className="txt-meta text-gray-500 text-sm">
                    {t("Reason stated")}: {candidateNotification.message}
                </p>
                <p className="txt-time text-end text-gray-500 text-xs">
                    {dateTimeFormat(candidateNotification.created_at, 'MMM d')}
                    {/*new Date(candidateNotification.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })*/}
                </p>
                {isNew && (
                    <span className="unread w-3.5 h-3.5 bg-blue-500 absolute top-3 end-4 rounded-full"></span>
                )}
            </div>
        </div>
    );
};

Unassigned.propTypes = {
    candidateNotification: PropTypes.shape({
        created_at: PropTypes.string.isRequired,
        is_new: PropTypes.bool.isRequired,
        message: PropTypes.string.isRequired,
        store: PropTypes.shape({
            store_name: PropTypes.string.isRequired,
        }),
    }).isRequired,
};

export default Unassigned;

// Tailwind CSS styles are applied directly in the component