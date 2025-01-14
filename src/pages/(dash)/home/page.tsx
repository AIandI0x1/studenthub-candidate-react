
// app/(dash)/dashboard/DashboardPage.jsx

import React, { Suspense, useEffect, useState } from 'react';
import { useIonRouter } from '@ionic/react';
import { profile } from '@/providers/logged-in/account.service';
//import { workHistory } from '@/providers/logged-in/candidate.service';
import AccountStatus from '@/components/app/account-status';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { CandidateWorkHistory } from '@/models/candidate-work-history';
import { listWorkHistory } from '@/providers/logged-in/candidate.service';
import { page, track } from '@/providers/analytics.service';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { setUser } from '@/store/slices/userSlice';
import { setOneSignal$ } from '@/providers/event.service';
import { Link } from 'react-router-dom';
import Loading from './loading';
import { dateTimeFormat } from '@/utils/common';
import LoadingHomePage from './loading';
import DashLayout from '../layout';


const HomePage = () => {
    
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [workHistory, setWorkHistory] = useState([]);
    const [updating, setUpdating] = useState(false);
    
    const router = useIonRouter();
    const { user } = useAppSelector(state => state.user);

    const { t } = useTranslation();
    const { showOneSignalPrompt, pushNotificationAvailable } = useAppSelector(state => state.app);

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (!user)
            loadProfile();

        loadWorkHistoryData();
        //setInvitationSubscription();

        page('Home Page');
 
        return () => {
            track('page_exit', { page: 'Home Page' });
        }
  
    }, []);

    const loadProfile = async () => {
        setLoadingProfile(true);
        try {
            const data = await profile();
            dispatch(setUser({
                user: data
            }));

        } catch (error) {
            console.error(error);
        } finally {
            setLoadingProfile(false);
        }
    };

    const setSubscription = () => {
        setOneSignal$.next({})
    };

    const loadWorkHistoryData = async () => {
        const response = await listWorkHistory();
        setWorkHistory(response);
    };
 

    //todo: 
    const downloadCertificate = async (event: any) => {
      /*  const modal = await openModal(WorkHistoryPage, { candidate, workHistory });
        modal.onDidDismiss();*/
    };

    const openModal = async (Component: any, props: any) => {
        // Implement modal opening logic here
    };

        {/* <Suspense fallback={<Loading />}> */}
        {/* </Suspense> */}
    return (
        <DashLayout>
        <div className="max-w-4xl mx-auto p-6">
             
            {loadingProfile && <LoadingHomePage />}

            {user && (
                <div>
                    {/* Student Account Status */}
                    <AccountStatus />

                    {/* Push Notification Card */}
                    {pushNotificationAvailable && showOneSignalPrompt && (
                        <Card className="p-0 mb-4">
                            <CardHeader>
                            <CardTitle className='font-bold'>
                                {t("Receive faster updates by enabling push notifications")}    
                            </CardTitle>
                        </CardHeader>
                        <CardContent>      
                            <p className="mt-[2px] mb-4 text-[#68687a] text-sm font-normal leading-tight">
                                { t("We’ll still email you important updates. This is cool if you aren’t an email person or would like to receive faster updates.") }</p>
                            <Button variant={'outline'} onClick={() => setSubscription()}>
                                { t("Enable notifications") }
                            </Button>
                        </CardContent>
                        </Card>
                    )}

                    {/* Scheduled Interviews Card */}
                    {user?.totalInterviewScheduled != undefined && user?.totalInterviewScheduled > 0 && (
                        <Card className="p-0 mb-4">
                             <CardHeader>
                            <CardTitle className='font-bold'>{t("Scheduled interviews")}</CardTitle>
                        </CardHeader>

                        <CardContent>    
                            <p className="mt-[2px] mb-4 text-[#68687a] text-sm font-normal leading-tight" dangerouslySetInnerHTML={{ 
                            __html: t('txt_interview_scheduled', { 
                                value: user.totalInterviewScheduled }) }}></p>
                            <Link to="/interview-list">
                                <Button variant={'outline'} className="btn-bank-detail">
                                    {t('View')}
                                </Button>
                            </Link>    
                        </CardContent>
                        </Card>
                    )}

                    {/* Civil ID Card */}
                    {(
                        !user?.candidate_civil_photo_front || 
                        !user?.candidate_civil_photo_back || 
                        !user?.candidate_civil_expiry_date || 
                        user?.civilExpired
                    ) && (
                        <Card className="p-0 mb-4"> 
                            <CardHeader>
                                <CardTitle className='font-bold'>
                                    {t("Urgent Civil Detail")}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>    
                                <p className="mt-[2px] mb-4 text-[#68687a] text-sm font-normal leading-tight">You won’t be able to receive payments until we have your valid civil ID.</p>
                                <Link to='/civil-id?fromProfile=1'>
                                <Button variant={'outline'} className="btn-civil-detail">
                                    {t("Upload Civil ID")}
                                </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    )}

                    {/* Bank Details Card */}
                    {user?.bank_account_needed == 1 && (
                        <Card className="p-0 mb-4">
                             <CardHeader>
                            <CardTitle className='font-bold' dangerouslySetInnerHTML={{ __html: t('urgent_bank_detail') }}></CardTitle>
                        </CardHeader>
                        <CardContent>    
                            <p className="mt-[2px] mb-4 text-[#68687a] text-sm font-normal leading-tight">
                                {t("You won’t be able to receive payments until we have your bank information to process your transfers.")}
                            </p>
                            <Link to='/bank'>
                            <Button variant={'outline'} className="btn-bank-detail">
                                {t("Enter my bank information")}
                            </Button>
                            </Link>
                        </CardContent>
                        </Card>
                    )}

                    {/* Video Recording Card */}
                    { !user?.candidate_video && (
                        <Card className="p-0 mb-4">
                            <CardHeader>
                            <CardTitle className='font-bold'>
                                {t("Increase your chances of landing a job by recording an intro video") }
                            </CardTitle>
                        </CardHeader>
                        <CardContent>  
                            <p className="mt-[2px] mb-4 text-[#68687a] text-sm font-normal leading-tight">
                                {t("While optional, an intro video makes your profile stand out to employers. It shows that you have the confidence required for the job and gives them the first impression they need to see you as something more than just a paper CV.")}
                            </p>
                            <Link to="/video?fromProfile=1">
                            <Button variant={'outline'} className="btn-video-recording">
                                {t("I’d like to start recording")}
                            </Button>
                            </Link>
                        </CardContent>
                        </Card>
                    )}

                    {/* Working Logs Card */}
                    {user?.working_hour_count > 0 && (
                        <Card className="p-0 mb-4">
                        <CardHeader>
                            <CardTitle className='font-bold'>{t("Working logs")}</CardTitle>
                        </CardHeader>
                        <CardContent> 
                            <Link to="/work-log/log-date-list">
                                <Button variant={'outline'} className="btn-video-recording">
                                    {t("Click here to view your working logs")}
                                </Button>
                            </Link>    
                        </CardContent>
                        </Card>
                    )}

                    {/* Wallet Card */}
                    <Card className="p-0 mb-4">
                        <CardHeader>
                            <CardTitle className='font-bold'>{t("Wallet")}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Link to="/wallet">
                            <Button variant={'outline'} className="btn-video-recording">
                                {t("Click here to view your wallet balance")}
                            </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    {/* Work History Card */}
                    {workHistory.length > 0 && (
                        
                        <div className="card-work-details">
                            
                            <h4 className='font-bold my-4'>{t("Your history with StudentHub")}</h4>

                            {workHistory.map((history: CandidateWorkHistory, index: number) => (
                                <Card key={index} className="p-0 mb-4">
                                    <CardHeader>
                                        <CardTitle className='font-bold'>
                                        { history.company.parentCompany && (
                                                 history.company.parentCompany.company_common_name_en? 
                                                 history.company.parentCompany.company_common_name_en: history.company.parentCompany.company_name) }
                                                 
                                            { !history.company.parentCompany && (
                                                 history.company.company_common_name_en? 
                                                 history.company.company_common_name_en: history.company.company_name) }

                                        </CardTitle>
                                        <CardDescription className='font-bold'>
                                            {history.store && history.store.store_name}
                                        </CardDescription>
                                    </CardHeader>
                                    
                                    <CardContent>
                                        <p className="mb-0 text-[#68687a] text-sm font-normal leading-tight">{
                                            `${dateTimeFormat(history.start_date || "", 'MMMM d, yyyy')} ${t('to')} 
                                            ${ history.end_date ? dateTimeFormat(history.end_date, 'MMMM d, yyyy') : t('now')}`
                                            }</p>
                                    </CardContent>
                                </Card>
                            ))}

                            {/*
                            <Button variant={'outline'} onClick={downloadCertificate} className="download-btn">
                                {t("Download Certificates")}
                            </Button>*/}
                        </div>
                    )}
                </div>
            )}
        </div>
        </DashLayout>
    );
};

export default HomePage;