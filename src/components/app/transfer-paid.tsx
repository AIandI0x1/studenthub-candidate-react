// components/App/TransferPaid.jsx

import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next'; // Assuming you're using react-i18next for translations
import { dateTimeFormat } from '@/utils/common';

const TransferPaid = ({ candidateNotification, onClick }: { candidateNotification: any, onClick: any }) => {
    const { t } = useTranslation();
    const [isNew, setIsNew] = React.useState(candidateNotification.is_new);

    return (
        <div onClick={() => onClick() && setIsNew(false)} className={ `${isNew? 'cursor-pointer': ''} card p-4 rounded-lg shadow-md bg-white relative`}>
            <h5 className="text-gray-900 font-semibold text-lg">{t("Compensation Transfer Paid")}</h5>
            <p className="text-gray-600 text-sm">
                {t("Congratulations! Your compensation has been transferred to your bank account.")}
            </p>
            <p className="txt-time text-end text-gray-500 text-xs">
                {dateTimeFormat(candidateNotification.created_at, 'MMM d')}
                {/*new Date(candidateNotification.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })*/}
            </p>
            {isNew && (
                <span className="unread w-3.5 h-3.5 bg-blue-500 absolute top-3 end-4 rounded-full"></span>
            )}
        </div>
    );
};

TransferPaid.propTypes = {
    candidateNotification: PropTypes.shape({
        created_at: PropTypes.string.isRequired,
        is_new: PropTypes.bool.isRequired,
    }).isRequired,
};

export default TransferPaid;

// Tailwind CSS styles are applied directly in the component