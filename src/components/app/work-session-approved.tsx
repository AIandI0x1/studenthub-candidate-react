import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next'; // Assuming you're using react-i18next for translations
import { format } from 'date-fns';
import { dateTimeFormat } from '@/utils/common';

const WorkSessionApproved = ({ candidateNotification, onClick }: { candidateNotification: any, onClick: any }) => {
  const { t } = useTranslation();
  const [isNew, setIsNew] = React.useState(candidateNotification.is_new);

  return (
    <div onClick={() => onClick() && setIsNew(false)} className={`p-3 flex flex-col gap-1 rounded-lg bg-white shadow-md relative ${isNew? 'cursor-pointer': ''}`}>
      <h5 className="text-gray-900 font-semibold text-lg leading-7 m-0">
        {t("Work Session Approved")}
      </h5>
      
      { candidateNotification.candidateWorkingHour && <p className="text-gray-600 text-sm leading-4 my-0">
        {t("txt_session_approved", {
          start_time: dateTimeFormat(candidateNotification.candidateWorkingHour.start_time, 'hh:mm a'),
          end_time: dateTimeFormat(candidateNotification.candidateWorkingHour.end_time, 'hh:mm a'),
          date: dateTimeFormat(candidateNotification.candidateWorkingHour.date, 'MMMM d, yyyy'),
        })}
      </p> }

      <p className="text-gray-500 text-xs text-end my-0">
        {dateTimeFormat(candidateNotification.created_at || '', 'MMM d')}
      </p>

      {isNew && (
        <span className="w-3.5 h-3.5 bg-blue-600 rounded-full absolute top-3 end-4"></span>
      )}
    </div>
  );
};

// PropTypes for type checking
WorkSessionApproved.propTypes = {
  candidateNotification: PropTypes.shape({
    candidateWorkingHour: PropTypes.shape({
      start_time: PropTypes.string.isRequired,
      end_time: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
    }).isRequired,
    created_at: PropTypes.string.isRequired,
    is_new: PropTypes.bool.isRequired,
  }).isRequired,
};

export default WorkSessionApproved;