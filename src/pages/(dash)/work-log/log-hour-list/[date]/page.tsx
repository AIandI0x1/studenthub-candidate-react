
// app/(dash)/log-hour-list/page.tsx

import { useEffect, useState, Suspense } from 'react';
import { useTranslation } from 'react-i18next'; // Assuming you have a translation hook
import { format, parseISO } from 'date-fns'; // For date formatting
import { useParams } from 'react-router-dom'; 
import { listHours, workingDateDetail } from '@/providers/logged-in/candidate-working-hour.service';
import { page, track } from '@/providers/analytics.service';
import WorkLog from '@/components/app/work-log';
import { dateTimeFormat } from '@/utils/common';
import Pager from '@/components/common/pager';
import Loading from './loading';
import { WorkLogDayStats } from '@/components/app/work-log-day-stats';
import DashLayout from '@/pages/(dash)/layout';

const LogHourListPage = () => {
  const { date } = useParams() as { date: string }; // Get date from URL parameters
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [candidateWorkingHourData, setCandidateWorkingHourData] = useState<any[]>([]);
  const [candidateWorkingDate, setCandidateWorkingDate] = useState<any>(null);
  
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_count: 0,
  });

  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    page('Candidate Working Hours');
    loadData();
    loadDetail();

    return () => {
      track('page_exit', { page: 'Candidate Working Hours' });
    }
  }, [date]);

  const loadDetail = async () => {
    const res = await workingDateDetail(date);
    setCandidateWorkingDate(res);
  };

  const loadData = async (page  = 1) => {
    setLoading(true);
    const response = await listHours(page, getUrlParams());
    setLoading(false);

    setPagination({
      current_page: parseInt(response.headers.get('x-pagination-current-page')),
      total_pages: parseInt(response.headers.get('x-pagination-page-count')),
      total_count: parseInt(response.headers.get('X-Pagination-Total-Count')),
    });

    setTotalCount(parseInt(response.headers.get('X-Pagination-Total-Count')));
    setCandidateWorkingHourData(response.data);
  };

  const doRefresh = async () => {
    await loadData();
    await loadDetail();
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

  const getUrlParams = () => {
    return `&date=${format(parseISO(date), 'yyyy-MM-dd')}`;
  };

  const logScrolling = (e: any) => {
    // Broadcast scroll event
  };


  //refresh on appeal?
  const onAppealClose = async (result: any) => {  
    if (result && result.refresh) {
      loadPage(1);
    }
  };

  return (
    <Suspense fallback={<Loading />}> 
      <DashLayout>  
      <div className=' bg-white'>
          <div className="max-w-4xl mx-auto px-6 shadow-[0px_10px_20px_0px_rgba(0,0,0,0.05) xs:pt-0 sm:pt-6 pb-6">

              <h5 className='text-[color:var(--Neutral-95,#23233D)] text-2xl font-bold leading-8 capitalize'>
              {dateTimeFormat(date || '', 'MMMM d, yyyy')}
              </h5>

          </div>    
      </div>
      
      <div className="max-w-4xl mx-auto p-6 w-full">
        { candidateWorkingDate && 
          <WorkLogDayStats candidateWorkingDate={candidateWorkingDate} />
          }

          { totalCount > 0 && (
          <div className="session-wrapper">
            
            <h5 className="text-[#22223d] text-lg font-semibold mb-4 leading-7">
              {t("Sessions")} <span className='text-[#7d7d8d]'>({totalCount})</span>
            </h5>

            {candidateWorkingHourData.map((hour) => (
              <WorkLog key={hour.candidate_working_hour_uuid} hour={hour} onAppealClose={onAppealClose} />
            ))}

            <Pager pagination={pagination} loadPage={loadPage} />

            </div>
          )} 

          {loading && <div className="progress-bar">{t("Loading...")}</div>}

      </div>  
      </DashLayout>
    </Suspense>
  );
};

export default LogHourListPage;