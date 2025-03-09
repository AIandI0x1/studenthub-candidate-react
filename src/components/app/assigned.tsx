// components/App/Assigned.jsx

import React from 'react';
import { useTranslation } from 'react-i18next'; // Assuming you're using react-i18next for translations
import PropTypes from 'prop-types';
import { CandidateNotification } from '@/models/candidate-notification';
import { dateTimeFormat } from '@/utils/common';

const Assigned = ({ candidateNotification, onClick }: { candidateNotification: CandidateNotification, onClick: any }) => {
    const { t } = useTranslation(); // Translation hook
    const [isNew, setIsNew] = React.useState(candidateNotification.is_new);
     
    return (
        <div onClick={() => onClick() && setIsNew(false)} className={ `${isNew? 'cursor-pointer': ''} rounded-lg shadow-md bg-white flex flex-col p-4 relative`}>
            <div className="flex flex-col">
                {candidateNotification.store && (
                    <h5 className="text-gray-900 font-semibold text-lg leading-7">
                        {t("txt_assigned_to_store", { store: candidateNotification.store.store_name })}
                    </h5>
                )}
                <p className="text-gray-600 text-sm leading-4">
                    {t("txt_assigned_on", { 
                        on: dateTimeFormat(candidateNotification.created_at, 'MMM d')
                        //new Date(candidateNotification.created_at).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }) 
                    })}
                </p>
                {candidateNotification.store && (
                    <p className="text-gray-900 text-base leading-5">
                        {t("txt_assigned_to_work_for", { store: candidateNotification.store.store_name })}
                    </p>
                )}
                
                { candidateNotification.company && <p className="text-gray-600 text-sm leading-4">
                    {t("hired_by", { by: candidateNotification.company.company_name })}
                    {/**, staff: candidateNotification.staff.staff_name */}
                </p> }

                <p className="text-end">
                    {dateTimeFormat(candidateNotification.created_at, 'MMM d')}
                    {/*new Date(candidateNotification.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })*/}
                    <span className={`w-3.5 h-3.5 bg-blue-500 rounded-full absolute top-3 end-4 ${isNew ? 'block' : 'hidden'}`}></span>
                </p>
   
                {isNew && (
                    <span className="w-3.5 h-3.5 bg-blue-600 rounded-full absolute top-3 end-4"></span>
                )}
            </div>
        </div>
    );
};

Assigned.propTypes = {
    candidateNotification: PropTypes.shape({
        store: PropTypes.shape({
            store_name: PropTypes.string,
        }),
        created_at: PropTypes.string.isRequired,
        staff: PropTypes.shape({
            staff_name: PropTypes.string.isRequired,
        }),
        is_new: PropTypes.bool.isRequired,
    }).isRequired,
};

export default Assigned;

// Tailwind CSS styles are applied directly in the component