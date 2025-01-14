"use client"
// app/(dash)/log-hour-list/page.tsx

import { useEffect, useState, Suspense } from 'react';
import { useTranslation } from 'react-i18next'; // Assuming you have a translation hook
import { useParams } from 'react-router-dom'; 
import { getWorkingHourAppeal, listHours, markAppealUpdateRead } from '@/providers/logged-in/candidate-working-hour.service';
import { page, track } from '@/providers/analytics.service';
import WorkLog from '@/components/app/work-log';
import Loading from './loading';
import { WorkLogDayStats } from '@/components/app/work-log-day-stats';
import { CandidateNotification } from '@/models/candidate-notification';
import { listNotifications, markNotificationRead } from '@/providers/logged-in/candidate-notification.service';

import { WorkHourAppealUpdate } from '@/components/app/work-hour-appeal-update';
import { CandidateWorkingHourAppealUpdate } from '@/models/candidate-working-hour-appeal-updates';
import { dateTimeFormat } from '@/utils/common';
import DashLayout from '@/pages/(dash)/layout';


const AppealDetailPage = () => {
    const { id } = useParams() as { id: string }; // Get date from URL parameters
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);

    const [candidateWorkingHourAppeal, setCandidateWorkingHourAppeal] = useState<any>();

    const [candidateWorkingHourData, setCandidateWorkingHourData] = useState<any[]>([]);
    const [candidateNotifications, setCandidateNotifications] = useState([]);

    const [pagination, setPagination] = useState({
        current_page: 1,
        total_pages: 1,
    });

    const [activityPagination, setActivityPagination] = useState({
        current_page: 1,
        total_pages: 1,
        total_activity: 0
    });

    const [totalActivity, setTotalActivity] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [totalUnreadActivity, setTotalUnreadActivity] = useState(0);

    useEffect(() => {
        page('Appeal Detail Page');

        loadDetail();
      //  loadData();
      //  loadActivity(1);

        return () => {
            track('page_exit', { page: 'Appeal Detail Page' });
        }
    }, [id]);

    useEffect(() => {

        /*alertCount$.subscribe((
            counts: any
        ) => {
            if (!counts)
                return null;

            if (totalUnreadActivity > 0 && totalUnreadActivity != counts.totalUnreadActivity) {
                loadActivity(1);
            }

            setTotalUnreadActivity(counts.totalUnreadActivity);
        });*/

    }, []);

    const loadDetail = async () => {
        setLoading(true);
        const res = await getWorkingHourAppeal(id);
        setCandidateWorkingHourAppeal(res);
        setLoading(false);
    };

    const loadData = async (page = 1) => {
        setLoading(true);
        const response = await listHours(page, getUrlParams());
        setLoading(false);

        setPagination({
            current_page: parseInt(response.headers.get('x-pagination-current-page')),
            total_pages: parseInt(response.headers.get('x-pagination-page-count'))
        });

        setTotalCount(parseInt(response.headers.get('X-Pagination-Total-Count')));
        setCandidateWorkingHourData(response.data);
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
        return `&appeal_uuid=${id}`;
    };

    //todo: update for this appeal notification only
    function getActivityUrlParams() {
        //invitation.request.requestSkills,
        return "&expand=candidateWorkingHour&appeal_uuid=" + id;
    }

    const loadActivityPage = (page: number) => {

        if ((page > 1 && page > activityPagination.total_pages) || page < 1) {
            return;
        }

        setActivityPagination({
            ...activityPagination,
            current_page: page
        });

        loadActivity(page);
    }

    const loadActivity = async (page = 1) => {
        setLoading(true);
        try {
            const response = await listNotifications(page, getActivityUrlParams());
            setCandidateNotifications(response.data);

            setActivityPagination({
                current_page: parseInt(response.headers['x-pagination-current-page']),
                total_pages: parseInt(response.headers['x-pagination-page-count']),
                total_activity: parseInt(response.headers['x-pagination-total-count']),
            });

            setTotalUnreadActivity(response.headers['X-total-unread-actity']);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const markRead = async (notification: CandidateNotification) => {
        notification.is_new = false;

        await markNotificationRead(notification.cn_uuid);
    };

    async function markUpdateAsRead(update: CandidateWorkingHourAppealUpdate) {
        update.is_new = false;

        await markAppealUpdateRead(update.appeal_update_uuid);
    }

    return (
        <Suspense fallback={<Loading />}>
            <DashLayout>  
            <div className=' bg-white'>
                <div className="max-w-4xl mx-auto px-6 shadow-[0px_10px_20px_0px_rgba(0,0,0,0.05) xs:pt-0 sm:pt-6 pb-6">

                    <h5 className='text-[color:var(--Neutral-95,#23233D)] text-2xl font-bold leading-8 capitalize'>
                      {t("Appeal for")}&nbsp;{candidateWorkingHourAppeal && candidateWorkingHourAppeal.candidateWorkingDate && 
                            dateTimeFormat(candidateWorkingHourAppeal.candidateWorkingDate.date || '', 'MMMM d, yyyy')}
                    </h5>

                </div>
            </div>

            <div className="max-w-4xl mx-auto p-6 w-full">

                {candidateWorkingHourAppeal && <>
                    {candidateWorkingHourAppeal.candidateWorkingDate &&
                        <div className="p-4 bg-white rounded-lg shadow gap-1.5 mb-6">
                             
                                <h5 className=" text-[#22223d] text-base font-medium leading-normal">
                                        {t('Appeal Details')}
                                </h5>
                                
                                <p className=" text-[#4b4b61] text-sm font-normal leading-tight my-2.5">
                                        {candidateWorkingHourAppeal.reason}
                                </p>

                                <p className=" text-[#22223d] text-xs font-normal leading-none mt-2.5">
                                        {dateTimeFormat(candidateWorkingHourAppeal.created_at, 'eee, d MMM')} &nbsp;| &nbsp;
                                        {dateTimeFormat(candidateWorkingHourAppeal.created_at, 'hh:mm a')}
                                </p>
                        </div>}

                    {candidateWorkingHourAppeal.candidateWorkingDate &&
                        <WorkLogDayStats candidateWorkingDate={candidateWorkingHourAppeal.candidateWorkingDate} />
                    }

                    <div className="p-4 bg-white rounded-lg shadow  mb-6">
                        <h5 className="grow shrink basis-0 text-[#22223d] text-base font-medium font-['Inter'] float-start leading-normal">
                            {t('Appeal Status')}
                        </h5>
                        <div className="px-1.5 py-0.5 bg-[#edfcf3] rounded-md float-end gap-2.5 flex">
                            <div className="text-right text-[#28b563] text-sm font-medium font-['Inter'] leading-tight">
                                {candidateWorkingHourAppeal.status == 10 && t("Submitted")}
                                {candidateWorkingHourAppeal.status == 1 && t("Awaiting Review")}
                                {candidateWorkingHourAppeal.status == 2 && t("In Progress")}
                                {candidateWorkingHourAppeal.status == 3 && t("Resolved")}
                            </div>
                        </div> 
                        <div className='clearfix' />
                        <div className="self-stretch justify-start items-center gap-1 inline-flex">
                            <div className="grow shrink basis-0 text-[#4b4b61] text-sm font-normal font-['Inter'] leading-tight">
                                {candidateWorkingHourAppeal.status == 10 &&
                                    t('Appeal received. Our team will review your case and mediate with the employer.')}

                                {candidateWorkingHourAppeal.status == 1 &&
                                    t('Your appeal has been sent. We will start working on the appeal as soon as the appeal has been reviewed.')}

                                {candidateWorkingHourAppeal.status == 2 &&
                                    t('Your appeal has been reviewed. We are currently working on it and will update you on any decisions made regarding your appeal.')}

                                {candidateWorkingHourAppeal.status == 3 &&
                                    t('Your appeal has been resolved. We appreciate you reaching out to us and hope that we were able to address your concerns satisfactorily.')}

                            </div>
                        </div>
                    </div>


                    { candidateWorkingHourAppeal.correctedHours && <div className="session-wrapper">

                        <h5 className="text-[#22223d] text-lg font-semibold mb-4 leading-7">
                            {t("Updated Work Sessions")} <span className='text-[#7d7d8d]'>({candidateWorkingHourAppeal.correctedHours.length + 1})</span>
                        </h5>

                        { candidateWorkingHourAppeal.originalHour && 
                            <WorkLog hour={candidateWorkingHourAppeal.originalHour} onAppealClose /> }

                        {candidateWorkingHourAppeal.correctedHours && candidateWorkingHourAppeal.correctedHours.map((hour: any) => (
                            <WorkLog key={hour.candidate_working_hour_uuid} hour={hour} onAppealClose />
                        ))}

                    </div> }

                </>}

                {/*loading && <div className="progress-bar">{t("Loading...")}</div>

                {activityPagination.total_activity > 0 && (
                    <div className="session-wrapper">

                        <h5 className="text-[#22223d] text-lg font-semibold mb-4 leading-7">
                            {t("Updates")} <span className='text-[#7d7d8d]'>({activityPagination.total_activity})</span>
                        </h5>

                        {candidateNotifications.map((candidateNotification: CandidateNotification) => (
                            <Activity markRead={markRead} candidateNotification={candidateNotification} />
                        ))}

                        <Pager pagination={activityPagination} loadPage={loadActivityPage} />

                    </div>
                )}*/}

                { 
                candidateWorkingHourAppeal && candidateWorkingHourAppeal.candidateWorkingHourAppealUpdates && 
                candidateWorkingHourAppeal.candidateWorkingHourAppealUpdates.map((update: any) => (
                    <WorkHourAppealUpdate onClick={() => markUpdateAsRead(update)} candidateWorkingHourAppealUpdate={update} />
                 ))
                }
                
            </div>
            </DashLayout>
        </Suspense>
    );
};

export default AppealDetailPage;