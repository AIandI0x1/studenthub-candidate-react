"use client"

// src/components/ActivityPage.tsx
import React, { Suspense, useEffect, useState } from 'react';
 
import { useTranslation } from 'react-i18next'; // For translations
import { CandidateNotification } from '@/models/candidate-notification';
import { page, track } from '@/providers/analytics.service';
import Pager from '@/components/common/pager';
import { listNotifications, markNotificationRead } from '@/providers/logged-in/candidate-notification.service';
import { alertCount$ } from '@/providers/event.service';
import NoItems from '@/components/common/no-items';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import Loading from './loading';
import { Activity } from '@/components/app/activity';

//todo: button to mark all as read

const ActivityPage = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [candidateNotifications, setCandidateNotifications] = useState([]);
  
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
  });
 
  const [showRefresh, setShowRefresh] = useState(false);
  const [totalUnreadActivity, setTotalUnreadActivity] = useState(0);

  useEffect(() => {
    alertCount$.subscribe((
      counts : any
    ) => {
      if(!counts)
        return null; 
         
      if (totalUnreadActivity > 0 && totalUnreadActivity != counts.totalUnreadActivity) {
        setShowRefresh(true);
      } /*else {
        this.showRefresh = false;
      }*/

      setTotalUnreadActivity(counts.totalUnreadActivity);
    });
  }, []);

  useEffect(() => {
    loadData();

    page('Activity List Page');

    return () => {
      track('page_exit', { page: 'Activity List Page' });
    }
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

  function getUrlParams() {
    //invitation.request.requestSkills,
    return "&expand=invitation,invitation.request,invitation.company," + 
      "company,staff,store,candidateWorkingHour,candidateWorkingDate,candidateWorkLogFeedback,candidateWorkLogFeedback.createdBy";
  }

  const loadData = async (page = 1) => {
    setLoading(true);
    try {
      const response = await listNotifications(page, getUrlParams());
      setCandidateNotifications(response.data);

      setPagination({
        current_page: parseInt(response.headers['x-pagination-current-page']),
        total_pages: parseInt(response.headers['x-pagination-page-count']),
      });

      setTotalUnreadActivity(response.headers['X-total-unread-actity']);
      
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const doRefresh = async (event: any) => {
    setShowRefresh(false);
    await loadPage(1);
  };

  const markRead = async (notification: CandidateNotification) => {
    notification.is_new = false;

    await markNotificationRead(notification.cn_uuid);
  };

  return ( 
    <Suspense fallback={<Loading />}>
      
      <div className=' bg-white'>
          <div className="max-w-4xl mx-auto px-6 shadow-[0px_10px_20px_0px_rgba(0,0,0,0.05) xs:pt-0 sm:pt-6 pb-6">

              <h5 className='text-[color:var(--Neutral-95,#23233D)] text-2xl font-bold leading-8 capitalize'>
                  { t('Activity')}
              </h5>

          </div>    
      </div>
      
      <div className="max-w-4xl mx-auto p-6"> 
         
        {showRefresh && (
          <Button onClick={doRefresh} className="rounded-full px-4 py-2 m-auto mb-4 block ">
            {t('Refresh')} <RefreshCw className='inline' />
          </Button>
        )}

        { candidateNotifications.map((candidateNotification: CandidateNotification) => (
          <Activity markRead={markRead} candidateNotification={candidateNotification} />
        ))}
        
        <Pager pagination={pagination} loadPage={loadPage} />
         
        {candidateNotifications.length === 0 && !loading && (
          <NoItems image="assets/icons/no-invitation.svg" 
            title={ 'There are no activity yet!' }
            message='' />
        )} 
      </div>
    </Suspense>
  );
};

export default ActivityPage;