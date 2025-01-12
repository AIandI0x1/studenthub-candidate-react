"use client"
import { alertDialog } from '@/hooks/use-alert-dialog';
// app/(dash)/request/RequestViewPage.tsx

import { Request } from '@/models/request';
import { page, track } from '@/providers/analytics.service';
import { viewRequest, applyRequest } from '@/providers/logged-in/request.service';
import { dateTimeFormat, errorMessage, toDate } from '@/utils/common';
import { useParams } from 'react-router-dom';    
import React, { Suspense, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Loading from '../loading';

const RequestViewPage = () => {

    const { id } = useParams() as { id: string };
    const [request, setRequest] = useState<Request | null>(null);
    const [loading, setLoading] = useState(false);
    const [applying, setApplying] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        loadDetails();

        page('Request View Page');

        return () => {
            track('page_exit', { page: 'Request View Page' });
        }
    }, []);

    const loadDetails = async () => {
        setLoading(true);
        const data = await viewRequest(id);
        setRequest(data);
        setLoading(false);
    };

    const apply = async () => {
        setApplying(true);
        const { data } = await applyRequest(id);
        if (data.operation === "success") {
            setRequest(prevRequest => ({ ...prevRequest, candidateApplication: data.candidateApplication }));
            dismiss();
        } else {
            alertDialog({
                title: t("Error"),
                description: errorMessage(data.message),
              });
        }
        setApplying(false);
    };

    const dismiss = () => {
        // Logic to dismiss the modal or navigate back
        window.history.back();
    };

    return (
        <Suspense fallback={<Loading />}> 
            <div className=' bg-white'>
                <div className="max-w-4xl mx-auto px-6 shadow-[0px_10px_20px_0px_rgba(0,0,0,0.05) xs:pt-0 sm:pt-6 pb-6">

                    <h5 className='text-[color:var(--Neutral-95,#23233D)] text-2xl font-bold leading-8 capitalize'>
                    { request? request.request_position_title:t('Request')}
                    </h5>

                </div>    
            </div>
                
            <div className="max-w-4xl mx-auto p-4">
            

                {loading && <div className="progress-bar">{t("Loading...")}</div>}

                {request && (
                    <div>
                        <p className="job-type">
                            {request.request_position_type === 1 ? t("You’d be working full-time as a") : t("You’d be working part-time as a")}
                        </p>
                        <p className="txt-position-title">{request.request_position_title}</p>

                        <p className="company">
                            {t("At")} <span>{request.company?.company_common_name_en || request.company?.company_name}</span>,
                        </p>

                        <p className="job-desc" dangerouslySetInnerHTML={{ __html: request.request_job_description || "" }}></p>

                        {request.request_compensation && (
                            <div>
                                <h3>{t("Compensation")}</h3>
                                <p className="job-compensation" dangerouslySetInnerHTML={{ __html: request.request_compensation }}></p>
                            </div>
                        )}

                        {request.request_location && (
                            <div>
                                <h2>{t("Job location")}</h2>
                                <p className="job-location">{request.request_location}</p>
                            </div>
                        )}

                        {request.requestSkills && request.requestSkills.length > 0 && (
                            <div>
                                <h2>{t("Skills")}</h2>
                                {request.requestSkills.map(skill => (
                                    <span key={skill.skill} className="ion-badge">{skill.skill}</span>
                                ))}
                            </div>
                        )}

                        {request.candidateApplication && (
                            <p>
                                {
                                    t("txt_applied_at", { 
                                        value: dateTimeFormat(request.candidateApplication.created_at || '', 'MMMM d, yyyy')
                                    })
                                }
                            </p>
                        )}
                    </div>
                )}

                {!request?.candidateApplication && (
                    <footer>
                        <button onClick={apply} disabled={applying} className="btn-apply">
                            {applying ? <span>{t("Loading...")}</span> : t("Apply")}
                        </button>
                    </footer>
                )}
            </div>
        </Suspense>   
    );
};

export default RequestViewPage;