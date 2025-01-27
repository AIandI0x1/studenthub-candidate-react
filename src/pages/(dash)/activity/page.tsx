

// src/components/ActivityPage.tsx
import { Suspense, useEffect, useRef, useState } from 'react';
 
import { useTranslation } from 'react-i18next'; // For translations
import { CandidateNotification } from '@/models/candidate-notification';
import { page, track } from '@/providers/analytics.service';
import Pager from '@/components/common/pager';
import { listNotifications, markAllNotificationsRead, markNotificationRead } from '@/providers/logged-in/candidate-notification.service';
import { alertCount$ } from '@/providers/event.service';
import NoItems from '@/components/common/no-items';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import Loading from './loading';
import { Activity } from '@/components/app/activity';
import DashLayout from '../layout';

//todo: button to mark all as read

const ActivityPage = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [candidateNotifications, setCandidateNotifications] = useState<CandidateNotification[]>([]);
  
  const [pagination, setPagination] = useState<{
    current_page: number | null;
    total_pages: number | null;
    total_count: number | null;
  }>({
    current_page: null,
    total_pages: null,
    total_count: null,
  });
 
  const [showRefresh, setShowRefresh] = useState(false);
  const [totalUnreadActivity, setTotalUnreadActivity] = useState(0);
 
  useEffect(() => {
    const subscription = alertCount$.subscribe((
      counts : any
    ) => {
     
      if(!counts)
        return null; 
         
      setTotalUnreadActivity(counts.totalUnreadActivity);

      checkRefresh(counts);
    });

    return () => {
      subscription.unsubscribe();
    }
  }, []);

  const checkRefresh = (counts: any) => {
    
    if (loading) 
      return;

    /*if (totalUnreadActivity > 0 && totalUnreadActivity != counts.totalUnreadActivity) {
        setShowRefresh(true);
      } else {
        this.showRefresh = false;
      }*/

    setPagination(pagination => {

      if (counts.totalActivity != pagination.total_count) {
        loadData(); 
      } 

      return pagination;
    });
  }

  useEffect(() => {
    loadData();

    page('Activity List Page');

    return () => {
      track('page_exit', { page: 'Activity List Page' });
    }
  }, []);

  const loadPage = (page: number) => {

    if ((page > 1 && pagination.total_pages && page > pagination.total_pages) || page < 1) {
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
      "company,staff,store,candidateWorkingHour,candidateWorkingDate,candidateWorkLogFeedback,candidateWorkLogFeedback.createdBy," +
      "job";
  }

  const loadData = async (page = 1) => {
    setLoading(true);
    try {
      const response = await listNotifications(page, getUrlParams());
      setCandidateNotifications(response.data);

      setPagination({
        current_page: parseInt(response.headers['x-pagination-current-page']),
        total_pages: parseInt(response.headers['x-pagination-page-count']),
        total_count: parseInt(response.headers['x-pagination-total-count'])
      });

      setTotalUnreadActivity(response.headers['x-total-unread-activity']);
      
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

  const markAllRead = async () => {

    await markAllNotificationsRead();

    setCandidateNotifications([]);
    setTimeout(() => {

      const newNotifications = candidateNotifications.map((notification: CandidateNotification) => {
        notification.is_new = false;
        return notification;
      });
      setCandidateNotifications(newNotifications);
    }, 10);
  };

  return ( 
    <Suspense fallback={<Loading />}>
      <DashLayout>
        
      <div className=' bg-white'>
          <div className="max-w-4xl mx-auto px-6 shadow-[0px_10px_20px_0px_rgba(0,0,0,0.05) xs:pt-0 sm:pt-6 pb-6">

              <h5 className='text-[color:var(--Neutral-95,#23233D)] text-2xl font-bold leading-8 capitalize'>
                { t('Activity')}
              
                { totalUnreadActivity > 0 && <Button onClick={() => markAllRead()} className="rounded-full px-4 py-2 m-auto mb-4 float-end">
                  {t('Mark all as read')} 
                </Button> }
              </h5>
          </div>    
      </div>
      
      <div className="max-w-4xl p-6 m-auto"> 
         
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
      
      </DashLayout>
    </Suspense>
  );
};

export default ActivityPage;