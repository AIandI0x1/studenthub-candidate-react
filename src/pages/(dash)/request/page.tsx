
// app/(dash)/request/RequestListPage.tsx

import { page, track } from '@/providers/analytics.service';
import { listRequests } from '@/providers/logged-in/request.service';
import React, { Suspense, useEffect, useState } from 'react';
import { Request } from '@/models/request';
import { useTranslation } from 'react-i18next';
import Pager from '@/components/common/pager';
import Loading from './loading';
import DashLayout from '../layout';

const RequestListPage = () => {
      
    const [loading, setLoading] = useState(false);
    const [requests, setRequests] = useState<Request[]>([]);
    
    const [pagination, setPagination] = useState({
        current_page: 1,
        total_pages: 1,
    });

    const { t } = useTranslation();

    useEffect(() => {
        page('Request List page');
        loadData();

        return () => {
            track('page_exit', { page: 'Request List page' });
        }
    }, []);

    const loadData = async (page = 1) => {
        setLoading(true);
        const response = await listRequests(page, "&expand=requestSkills,candidateApplication");
        setRequests(response.data);

        setPagination({
            current_page: parseInt(response.headers.get('x-pagination-current-page')),
            total_pages: parseInt(response.headers.get('x-pagination-page-count'))
        });

        setLoading(false);
    };

  const loadPage = (page: number) => {

    if ((page > 1 && page > pagination.total_pages) || page < 1) {
      return;
    }

    setPagination({
      ...pagination,
      current_page: page
    });

    loadData(page);
  }

    const viewRequest = async (event: React.MouseEvent<HTMLDivElement>, request: Request) => {
        event.preventDefault();
        event.stopPropagation();

        /*const modal = await window.customElements.get('request-view-page').create({
            request: request,
            request_uuid: request.request_uuid
        });

        modal.onDidDismiss().then(e => {
            if (!e.data || e.data.from !== 'native-back-btn') {
                window.history.back();
            }
        });
        modal.present();*/
    };

    return (
        <Suspense fallback={<Loading />}> 
        <DashLayout>  
        <div className=' bg-white'>
            <div className="max-w-4xl mx-auto px-6 shadow-[0px_10px_20px_0px_rgba(0,0,0,0.05) xs:pt-0 sm:pt-6 pb-6">

                <h5 className='text-[color:var(--Neutral-95,#23233D)] text-2xl font-bold leading-8 capitalize'>
                { t('Jobs')}
                </h5>

            </div>    
        </div>
        
        <div className="max-w-4xl mx-auto p-4"> 
            <header className="flex items-center justify-between">
                <h1 className="text-xl font-bold">{t("Jobs")}</h1>
            </header>

            {loading && <div className="progress-bar">{t("Loading...")}</div>}

            <div className="max-width">
                {requests.length > 0 ? (
                    requests.map((request: Request) => (
                        <div key={request.request_uuid} className="request-listing" onClick={(e) => viewRequest(e, request)}>
                            {/* Replace with your request listing component */}
                            <div className="bg-white shadow-md rounded-lg p-4 mb-4">
                                <h2>{request.request_position_title}</h2>
                                {/* Add more request details here */}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center">{t("No match found yet")}</p>
                )}

                <Pager pagination={pagination} loadPage={loadPage} />
 
            </div>
        </div>
        </DashLayout>
        </Suspense>
    );
};

export default RequestListPage;