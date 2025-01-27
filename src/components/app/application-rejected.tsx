import React from 'react';
import { useTranslation } from 'react-i18next'; // Assuming you're using react-i18next for translations
import { CandidateNotification } from '@/models/candidate-notification';
import { dateTimeFormat, langContent } from '@/utils/common';

export default function ApplicationRejected({ candidateNotification, onClick }: { candidateNotification: CandidateNotification, onClick: any }) {
    const { t } = useTranslation(); // Translation hook
    const [isNew, setIsNew] = React.useState(candidateNotification.is_new);
    
    return (
        <div onClick={() => onClick() && setIsNew(false)} className={ `${isNew? 'cursor-pointer': ''} rounded-lg shadow-md bg-white flex flex-col p-4 relative`}>
            <div className="flex flex-col">
                {candidateNotification.store && (
                    <h5 className="text-gray-900 font-semibold text-lg leading-7">
                        {t("Your application has been rejected")}
                    </h5>
                )}
                
                { candidateNotification.job && <p className="text-gray-600 text-sm leading-4">
                    {t("txt_rejected_for", { 
                        position: langContent(candidateNotification.job.position, candidateNotification.job.position_ar)
                    })}
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
}