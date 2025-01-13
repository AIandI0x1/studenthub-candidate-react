"use client"
// app/(dash)/work-history/WorkHistoryPage.tsx

import { page, track } from '@/providers/analytics.service';
import { downloadCertificate, listWorkHistory } from '@/providers/logged-in/candidate.service';
import { dateTimeFormat } from '@/utils/common';
import React, { Suspense, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Loading from './loading';
import DashLayout from '../layout';

const WorkHistoryPage = () => {

    const [workHistory, setWorkHistory] = useState([]);
    const [downloading, setDownloading] = useState(false);

    const { t } = useTranslation();
    useEffect(() => {
        page('Work History Page');
        // Load work history data here
        loadWorkHistory();

        return () => {
            track('page_exit', { page: 'Work History Page' });
        }
    }, []);

    const loadWorkHistory = async () => {
        // Fetch work history from the candidate service
        const history = await listWorkHistory();
        setWorkHistory(history);
    };

    const dismiss = () => {
      //  history.goBack();
    };

    const isFutureDate = (date: Date) => {
        return new Date(date) > new Date();
    };

    const download = async (historyItem: any) => {
        setDownloading(true);
        try {
            await downloadCertificate(historyItem.id);
            // Optionally show a success message
        } catch (error) {
            // Handle error
        } finally {
            setDownloading(false);
        }
    };

    return (
        <Suspense fallback={<Loading />}> 
        <DashLayout>  
        <div className=' bg-white'>
            <div className="max-w-4xl mx-auto px-6 shadow-[0px_10px_20px_0px_rgba(0,0,0,0.05) xs:pt-0 sm:pt-6 pb-6">

                <h5 className='text-[color:var(--Neutral-95,#23233D)] text-2xl font-bold leading-8 capitalize'>
                { t('Certificates')}
                </h5>

            </div>    
        </div>
        <div className="max-w-4xl mx-auto p-4">
             
            <p>{t("You can download the following certificates as proof of the experience you’ve accumulated through StudentHub.")}</p>

            {workHistory.length > 0 ? (
                <ul className="list-none">
                    {workHistory.map((historyItem: any) => (
                        <li key={historyItem.id} className="bg-white shadow-md rounded-lg p-4 mb-4 flex justify-between items-center">
                            <div>
                                <h2 className="font-semibold">
                                    {historyItem.company.parentCompany ? 
                                        (historyItem.company.parentCompany.company_common_name_en || historyItem.company.parentCompany.company_name) : 
                                        (historyItem.company.company_common_name_en || historyItem.company.company_name)}
                                </h2>
                                <h5>{historyItem.store?.store_name}</h5>
                                <p>
                                    {dateTimeFormat(historyItem.start_date || '', 'MMMM d, yyyy')} 
                                    {historyItem.end_date ? 
                                        ` ${t("to")} ${dateTimeFormat(historyItem.end_date || '', 'MMMM d, yyyy')}` : 
                                        !isFutureDate(historyItem.start_date) ? ` ${t("to")} ${t("now")}` : ''}
                                </p>
                            </div>
                            <button className="btn-download" onClick={() => download(historyItem)}>
                                <i className="icon-arrow-down"></i>
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>{t("No work history available.")}</p>
            )}
        </div>
        </DashLayout>
        </Suspense>
    );
};

export default WorkHistoryPage;