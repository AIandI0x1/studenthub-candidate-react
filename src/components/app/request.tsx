// components/App/RequestListing.jsx

import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next'; // Assuming you're using react-i18next for translations
import { dateTimeFormat } from '@/utils/common';

const RequestListing = ({ request, interview }: { request: any, interview: any }) => {
    const { t } = useTranslation();

    return (
        request && (
            <div className={`ion-card ${request.request_status === 'pending' ? 'pending' : ''} my-4 rounded-lg shadow-md bg-white`}>
                <div className="ion-card-content p-0">
                    <div className="inner-card-content p-3">
                        <h1 className="font-bold text-lg text-start text-gray-800">{request.request_position_title}</h1>

                        {request.company && (
                            <h3 className="font-semibold text-md text-start text-gray-600">
                                {request.company.company_common_name_en || request.company.company_name}
                            </h3>
                        )}

                        <small className="time text-gray-500 text-xs">{request.request_created_datetime}</small>

                        <div className="mt-2">
                            {request.requestSkills.map((requestSkill: any, index: number) => (
                                <span key={index} className="ion-badge bg-blue-500 text-white mr-2">
                                    {requestSkill.skill}
                                </span>
                            ))}
                            {request.request_position_type === 1 && (
                                <span className="ion-badge bg-blue-500 text-white mr-2">
                                    {t('Full-time')}
                                </span>
                            )}
                            {request.request_position_type === 2 && (
                                <span className="ion-badge bg-blue-500 text-white mr-2">
                                    {t('Part-time')}
                                </span>
                            )}
                            {request.request_location && (
                                <span className="ion-badge bg-blue-500 text-white mr-2">
                                    {request.request_location.length > 30 ? `${request.request_location.substr(0, 30)}...` : request.request_location}
                                </span>
                            )}
                            {request.company && request.company.country && (
                                <span className="ion-badge bg-blue-500 text-white">
                                    {request.company.country.country_name_en}
                                </span>
                            )}
                        </div>

                        {request.candidateApplication && (
                            <p className="txt-applied text-gray-600 mt-2">
                                {t("txt_applied_at", {
                                    value: dateTimeFormat(request.candidateApplication.created_at, 'MMM d, yyyy')
                                    //new Date(request.candidateApplication.created_at).toLocaleDateString(),
                                })}
                            </p>
                        )}

                        {interview && (
                            <div className="interview-wrapper border border-gray-300 rounded-lg p-3 mt-3">
                                <p className="interview-time">
                                    {interview.status === 0 && (
                                        <span>
                                            {t("txt_requested_at", {
                                                value: dateTimeFormat(interview.interview_at, 'MMM d, yyyy')
                                                //new Date(interview.interview_at).toLocaleString(),
                                            })}
                                        </span>
                                    )}
                                    {interview.status === 1 && (
                                        <span>
                                            {t("txt_schedule_at", {
                                                value: dateTimeFormat(interview.interview_at, 'MMM d, yyyy')
                                                //new Date(interview.interview_at).toLocaleString(),
                                            })}
                                        </span>
                                    )}
                                    {interview.status === 2 && <span>{t("Interview schedule request rejected")}</span>}
                                    {interview.status === 3 && <span>{t("Interview schedule request cancelled")}</span>}
                                </p>
                                <div className="txt-interview-note" dangerouslySetInnerHTML={{ __html: interview.interview_note }} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    );
};

RequestListing.propTypes = {
    request: PropTypes.shape({
        request_position_title: PropTypes.string.isRequired,
        request_created_datetime: PropTypes.string.isRequired,
        request_status: PropTypes.string.isRequired,
        requestSkills: PropTypes.arrayOf(PropTypes.shape({
            skill: PropTypes.string.isRequired,
        })).isRequired,
        company: PropTypes.shape({
            company_common_name_en: PropTypes.string,
            company_name: PropTypes.string.isRequired,
            country: PropTypes.shape({
                country_name_en: PropTypes.string,
            }),
        }),
        request_position_type: PropTypes.number,
        request_location: PropTypes.string,
        candidateApplication: PropTypes.shape({
            created_at: PropTypes.string.isRequired,
        }),
    }).isRequired,
  //  invitation: PropTypes.object, // Define the shape if needed
    interview: PropTypes.shape({
        status: PropTypes.number.isRequired,
        interview_at: PropTypes.string.isRequired,
        interview_note: PropTypes.string,
    }),
};

export default RequestListing;

// Tailwind CSS styles are applied directly in the component