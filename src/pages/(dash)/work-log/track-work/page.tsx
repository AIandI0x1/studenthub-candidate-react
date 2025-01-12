"use client"
// app/(dash)/track-work/page.tsx

import { Suspense, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next'; // Assuming you have a translation hook
import { Geolocation } from '@capacitor/geolocation'; // Assuming you're using Capacitor for geolocation
import {  ChevronLeft, ChevronRight } from 'lucide-react';
import { dateTimeFormat, secondsToTime } from '@/utils/common';
import { CandidateWorkingHour } from '@/models/candidate';
import { checkWorkStatus, startWork, stopWork, discardSession } from '@/providers/logged-in/account.service';
import { listHours } from '@/providers/logged-in/candidate-working-hour.service';
import LogTimeManuallyPage from '../../../../components/modals/log-time-manually/page';
import EndSessionPage from '../../../../components/modals/end-session/page';

import { page, track } from '@/providers/analytics.service';
import Pager from '@/components/common/pager';
import { format } from 'date-fns';
import { Timer } from '@/components/common/timer';
import { setUser } from '@/store/slices/userSlice';
import { RootState, useAppDispatch, useAppSelector } from '@/store/store';
import { workingDateStats } from '@/providers/logged-in/candidate-working-hour.service';
import i18n from '@/18n';
import Loading from './loading';

const TrackWorkPage = () => {
  const { t } = useTranslation();
  const [started, setStarted] = useState(null);
  const [loading, setLoading] = useState(false);
  const [savingHours, setSavingHours] = useState(false);
  const [startingWork, setStartingWork] = useState(false);
  
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.user);

  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 0,
    total_count: 0
  });

  const [candidateWorkingHourData, setCandidateWorkingHourData] = useState([]);
  const [today, setToday] = useState(new Date());
  const [stats, setStats] = useState<any>(null);

  const [modalStopWorkIsOpen, setModalStopWorkIsOpen] = useState(false);
  const [modalLogTimeIsOpen, setModalLogTimeIsOpen] = useState(false);

  useEffect(() => {
    // Check if user is working and load initial data
    loadInitialData();

    page('Track Work Page');

    return () => {
      track('page_exit', { page: 'Track Work Page' });
    }
  }, []);

  const loadInitialData = async () => {
    // Load user work status, sessions, and stats
    await checkStatus();
    await loadSessions();
    await loadStats();
  };

  const checkStatus = async () => {
    const data = await checkWorkStatus();
    if (data) {
      setStarted(data.start_time);
    }
  };

  const loadStats = async () => {
    const response = await workingDateStats(getUrlParams());
    console.log(response, 'stats');
    setStats(response);
  };

  const loadSessions = async (page = 1) => {
    setLoading(true);
    const response = await listHours(page, getUrlParams());

    setPagination({
      current_page: parseInt(response.headers.get('x-pagination-current-page')),
      total_pages: parseInt(response.headers.get('x-pagination-page-count')),
      total_count: parseInt(response.headers.get('X-Pagination-Total-Count')),
    });

    setCandidateWorkingHourData(response.data);
    setLoading(false);
  };

  const loadPage = (page: number) => {

    if (page > pagination.total_pages || page < 1) {
      return;
    }

    setPagination({
      ...pagination,
      current_page: page
    });

    loadSessions(page);
  }

  const getUrlParams = () => {
    return `&date=${today.toISOString().split('T')[0]}`; // Format date as YYYY-MM-DD
  };

  const handleRefresh = async () => {
    await checkStatus();
    await loadSessions();
    await loadStats();
  };

  const toggleTrack = () => {
    if (started) {
      setModalStopWorkIsOpen(true);
    } else {
      startWorkClicked();
    }
  };

  const startWorkClicked = async () => {
    setStartingWork(true);
    const resp = await Geolocation.getCurrentPosition();
    if (resp && resp.coords) {
      const json = await startWork(resp.coords.latitude, resp.coords.longitude);
      if (json.operation === "success") {
        setStarted(json.data.start_time);
       // user.isWorking = json.data;
        dispatch(setUser({
          user: {
            ...user,
            isWorking: json.data
          }
        }))
        await loadStats();
      }
    }
    setStartingWork(false);
  };

  const stopWorkClicked = async () => {
    setSavingHours(true);
    const resp = await Geolocation.getCurrentPosition();
    if (resp && resp.coords) {
      await stopWork(resp.coords.latitude, resp.coords.longitude);
      setStarted(null);
      await loadSessions();
      await loadStats();
    }
    setSavingHours(false);
  };

  const handleModalStopWorkClose = async (result: any) => {
    setModalStopWorkIsOpen(false);
    if (result && result.submit) {
      await stopWorkClicked();
    } else if (result && result.discard) {
      discardSessionClicked();
    }
  };
 
  const discardSessionClicked = async () => {
    await discardSession();
    setStarted(null);
  };

  const handleModalLogTimeClose = async (result: any) => {  
    setModalLogTimeIsOpen(false);
    if (result && result.refresh) {
      await loadSessions();
      await loadStats();
    }
  };

  return (
    <Suspense fallback={<Loading />}> 
      <div className=' bg-white'>
            <div className="max-w-4xl mx-auto px-6 shadow-[0px_10px_20px_0px_rgba(0,0,0,0.05) xs:pt-0 sm:pt-6 pb-6">

                <h5 className='text-[color:var(--Neutral-95,#23233D)] text-2xl font-bold leading-8 capitalize'>
                { t('Track')}
                </h5>

            </div>    
        </div>
        <div className="max-w-4xl mx-auto p-4">

      { today && <div className="current-datetime text-center my-2">
        <b className="text-black text-lg font-medium leading-7">{format(today, 'hh:mm a')}</b>
        <br />
        <span className="text-neutral-700 text-sm font-normal leading-5">{format(today, 'MMMM d, yyyy')}</span>
      </div> }
 
      <div className="w-[184px] h-[184px] p-3 mx-auto my-2 rounded-[96px] border-2 border-[#c5c5cc] justify-center items-center flex">
        
        { !started && <div className={ `${savingHours || startingWork ? 'opacity-70' : ''} cursor-pointer w-40 h-40 relative bg-[#4c6ff2] rounded-[80px] shadow items-center justify-center` } 
            onClick={ () => !(savingHours || startingWork) && toggleTrack()}>

            {savingHours || startingWork ? 
              <div className={ `${i18n.language == "en"? 'left-[52px]': 'left-[52px]'} top-[66px] absolute text-white` }>
                { savingHours? t('Saving...'): t('Starting...')}
              </div> : null}

            {!savingHours && !startingWork && <div className={ `${i18n.language == "en"? 'left-[41px]': 'left-[65px]'} top-[52px] absolute text-center text-white text-lg font-semibold leading-7` }>
              {t("Start")}<br/>{t("Tracking")}
            </div> }
        </div> }

        { started && 
        <div className="cursor-pointer w-28 h-28 pl-[22px] pr-[21px] pt-7 pb-[29px] bg-[#eb5757] rounded-[32px] shadow flex-col justify-center items-center gap-2 inline-flex"
          onClick={ () => !(savingHours || startingWork) && toggleTrack()}>
            <div className="text-center text-white text-lg font-semibold leading-7">{t("End")}</div>
            <div>
              <Timer start={started} />
            </div>
        </div> }
  
      </div>

      <button onClick={() => setModalLogTimeIsOpen(true)} className="m-auto block text-center text-neutral-600 text-sm font-medium leading-5">
        {t("Manual Logging")}
        { i18n.language == "ar"? <ChevronLeft className="text-gray-600 text-xl inline" />: 
          <ChevronRight className="text-gray-600 text-xl inline" /> }
        
      </button>

      <div className="w-full max-w-[400px] mx-auto h-11 justify-start items-start gap-[52px] flex mt-8">
        <div className="grow shrink basis-0 flex-col justify-center items-center inline-flex">
            <div className="self-stretch text-center text-black text-base font-medium leading-normal">
            {stats?.checkIn ? dateTimeFormat(stats.checkIn, "hh:mm a") : '00:00'}
            </div>
            <div className="self-stretch text-center text-[#68687a] text-sm font-normal leading-tight">
            {t("Check-in")}
            </div>
        </div>
        <div className="grow shrink basis-0 flex-col justify-center items-center inline-flex">
            <div className="self-stretch text-center text-black text-base font-medium leading-normal">
            {stats?.checkOut ? dateTimeFormat(stats.checkOut, "hh:mm a") : '00:00'}
            </div>
            <div className="self-stretch text-center text-[#68687a] text-sm font-normal leading-tight">
            {t("Check-out")}
            </div>
        </div>
        <div className="grow shrink basis-0 flex-col justify-center items-center inline-flex">
            <div className="self-stretch text-center text-black text-base font-medium leading-normal">
            {stats?.totalTime ? secondsToTime(stats.totalTime) : '00:00'}
            </div>
            <div className="self-stretch text-center text-[#68687a] text-sm font-normal leading-tight">
            {t("Total hours")}
            </div>
        </div>
    </div>
 
    {candidateWorkingHourData.length > 0 && <div className="session-wrapper mt-6">
        <h5 className="txt-session-heading text-neutral-900 text-lg font-semibold leading-7 border-t border-neutral-300 pt-6">
          {t("Sessions")} <span className="text-[#7D7D8D]">({pagination.total_count})</span>
        </h5>

        {candidateWorkingHourData.map((hour: CandidateWorkingHour) => (

          <p key={hour.candidate_working_hour_uuid} className="flex justify-between items-center bg-white shadow-md rounded-lg p-4 my-4" >
            <b className="text-neutral-900 text-base font-medium leading-6">
              { hour.total_time ? secondsToTime(hour.total_time): "On-Going" } 
            </b>
            <span className="text-neutral-600 text-sm font-normal leading-5" dir='ltr'>
              { hour.start_time ? dateTimeFormat(hour.start_time, "hh:mm a") : '00:00'} 
              { /**<ArrowRight className="inline text-gray-600 text-small" /> */}
               
                &nbsp;<img src='/assets/icons/chevron-right.svg' className="inline relative top-[-2px]" />&nbsp;
                { hour.end_time ? dateTimeFormat(hour.end_time, "hh:mm a") : 'Now'}
                
            </span>
          </p>
        ))}

        <Pager pagination={pagination} loadPage={loadPage} />
    
      </div> }

      { modalStopWorkIsOpen && <EndSessionPage onClose={handleModalStopWorkClose} /> }
      { modalLogTimeIsOpen && <LogTimeManuallyPage onClose={handleModalLogTimeClose} /> }

      { /**<Modal
            isOpen={modalStopWorkIsOpen}
            onRequestClose={() => handleModalStopWorkClose(null)}
            contentLabel="Modal"
          >
            <EndSessionPage onClose={handleModalStopWorkClose} />
          </Modal> */}
    </div>
      </Suspense>
    
  );
};

export default TrackWorkPage;