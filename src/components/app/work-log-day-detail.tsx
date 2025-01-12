import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next'; // Assuming you're using react-i18next for translations
import { dateTimeFormat, secondsToTime } from '@/utils/common';
import { format } from 'date-fns';
import { CandidateWorkingDate } from '@/models/candidate-working-date';

const WorkLogDayDetail = ({ candidateWorkingDate }: { candidateWorkingDate: CandidateWorkingDate}) => {
  const { t } = useTranslation();

  return (
    <div className="mb-4 p-4 rounded-lg bg-white shadow-md">
      <div className="cursor-pointer" onClick={() => {/* handle navigation */}}>
        <span className="text-gray-600 text-sm font-medium">{t("Total Time")}</span>

        <ul className="flex gap-2 mt-2">
          {candidateWorkingDate.total_pending > 0 && (
            <li className="bg-orange-200 text-orange-800 px-2 py-1 rounded">{candidateWorkingDate.total_pending}</li>
          )}
          {candidateWorkingDate.total_approved > 0 && (
            <li className="bg-green-200 text-green-800 px-2 py-1 rounded">{candidateWorkingDate.total_approved}</li>
          )}
          {candidateWorkingDate.total_rejected > 0 && (
            <li className="bg-red-200 text-red-800 px-2 py-1 rounded">{candidateWorkingDate.total_rejected}</li>
          )}
        </ul>

        <h4 className="text-gray-900 text-lg font-semibold mt-4">
          {candidateWorkingDate.total_time ? 
            secondsToTime(candidateWorkingDate.total_time) : 
            "00:00"}
        </h4>

        <div className="border-t border-gray-300 mt-4 pt-4">
          <div className="flex justify-between">
            <div className="flex items-center">
              <b className="text-gray-900 font-semibold mr-1">{t("Start Time:")}</b>
              <span>
                {candidateWorkingDate.start_time ? 
                  dateTimeFormat(candidateWorkingDate.start_time || '', 'hh:mm a') : 
                  "00:00"}
              </span>
            </div>

            <div className="flex items-center">
              <b className="text-gray-900 font-semibold mr-1">{t("End Time:")}</b>
              <span>
                {candidateWorkingDate.end_time ? 
                  dateTimeFormat(candidateWorkingDate.end_time || '', 'hh:mm a')  : 
                  "00:00"}
              </span>
            </div>
          </div>
        </div>

        <ul className="flex gap-2 mt-3">
          {candidateWorkingDate.total_pending > 0 && (
            <li className="bg-orange-200 text-orange-800 px-2 py-1 rounded">
              {candidateWorkingDate.total_pending} {t("Pending")}
            </li>
          )}
          {candidateWorkingDate.total_approved > 0 && (
            <li className="bg-green-200 text-green-800 px-2 py-1 rounded">
              {candidateWorkingDate.total_approved} {t("Approved")}
            </li>
          )}
          {candidateWorkingDate.total_rejected > 0 && (
            <li className="bg-red-200 text-red-800 px-2 py-1 rounded">
              {candidateWorkingDate.total_rejected} {t("Rejected")}
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

// PropTypes for type checking
WorkLogDayDetail.propTypes = {
  candidateWorkingDate: PropTypes.shape({
    candidate_id: PropTypes.string,
    date: PropTypes.string,
    store_id: PropTypes.string,
    total_pending: PropTypes.number,
    total_approved: PropTypes.number,
    total_rejected: PropTypes.number,
    total_time: PropTypes.number,
    start_time: PropTypes.string,
    end_time: PropTypes.string,
  }).isRequired,
};

export default WorkLogDayDetail;