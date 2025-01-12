"use client"
// app/(dash)/interview/InterviewListPage.jsx

import Request from '@/components/app/request';
import Pager from '@/components/common/pager';
import { page, track } from '@/providers/analytics.service';
import { requestUpdated$ } from '@/providers/event.service';
import { listInterviewRequests } from '@/providers/logged-in/request.service';
import React, { Suspense, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Loading from './loading';


const InterviewListPage = () => {
    const [loading, setLoading] = useState(false);
    const [interviews, setInterviews] = useState<any[]>([]);

    const { t } = useTranslation();
    
    const [pagination, setPagination] = useState({
        current_page: 1,
        total_pages: 1,
    });

    useEffect(() => {
        page('Interview List page');
        loadData();

        const subscription = requestUpdated$.subscribe(() => {
            loadData();
        });

        return () => {
            subscription.unsubscribe();
            track('page_exit', { 'page': 'Interview List page' });
        };
    }, []);

  const loadPage = (page: number) => {

    if (page > pagination.total_pages || page < 1) {
      return;
    }

    setPagination({
      ...pagination,
      current_page: page
    });

    loadData(page);
  }

    const loadData = async (page = 1) => {
        setLoading(true);
        const response = await listInterviewRequests(page);
        setInterviews(response.data);

        setPagination({
            current_page: parseInt(response.headers.get('x-pagination-current-page')),
            total_pages: parseInt(response.headers.get('x-pagination-page-count'))
        });

        setLoading(false);
    };

    return (
        <Suspense fallback={<Loading />}>  
            <div className=' bg-white'>
                <div className="max-w-4xl mx-auto px-6 shadow-[0px_10px_20px_0px_rgba(0,0,0,0.05) xs:pt-0 sm:pt-6 pb-6">

                    <h5 className='text-[color:var(--Neutral-95,#23233D)] text-2xl font-bold leading-8 capitalize'>
                    { t('Interviews')}
                    </h5>

                </div>    
            </div>
            
            <div className="max-w-4xl mx-auto p-4">
                <h3 className="text-3xl font-bold capitalize">
                    {t("Scheduled Interviews")}
                </h3>
                {loading && <div className="progress-bar">{t("Loading...")}</div>}
                <div className="flex flex-col">
                    {interviews.map((interview) => (
                        <Request key={interview.id} request={interview.request} interview={interview} />
                    ))}
                    {!loading && interviews.length === 0 && (
                        <p>~ {t("Your scheduled interviews will be listed here")} ~</p>
                    )}
                </div>  


                <Pager pagination={pagination} loadPage={loadPage} />
            
            </div>
        </Suspense>
    );
};

export default InterviewListPage;