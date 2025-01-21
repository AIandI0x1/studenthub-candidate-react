
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
// app/(dash)/invitation/InvitationDetailPage.jsx

import { Invitation } from '@/models/invitation';
import { page, track } from '@/providers/analytics.service';
import { requestUpdated$ } from '@/providers/event.service';
import { detailInvitation } from '@/providers/logged-in/invitation.service';
import { useParams } from 'react-router-dom'; 
import { Suspense, useEffect, useState } from 'react';
import CompanyPage from '../../../../components/modals/company/page';
import { useTranslation } from 'react-i18next';
import FeedbackPage from '../../../../components/modals/feedback/page';
import Loading from '../loading';
import DashLayout from '../../layout';

const InvitationDetailPage = () => {
    const { id } = useParams() as { id: string };
    const [loading, setLoading] = useState(false);
    const [companyOpen, setCompanyOpen]  = useState(false);
    const [model, setModel] = useState<Invitation | null>(null);
    const [feedbackOpen, setFeedbackOpen] = useState(false);
    const [invitationStatus, setInvitationStatus] = useState(0);

    const { t }  = useTranslation();

    useEffect(() => {
        page('Invitation Detail page');
        loadInvitationDetail();

        const subscription = requestUpdated$.subscribe(() => {
            loadInvitationDetail();
        });

        return () => {
            subscription.unsubscribe();
            track('page_exit', { 'page': 'Invitation Detail page' });
        };
    }, []);

    const loadInvitationDetail = async () => {
        setLoading(true);
        const data = await detailInvitation(id);
        setModel(data);
        setLoading(false);
    };

    const accept = async () => {
        /*const invitation = { ...model, invitation_status: 3 }; // accept
        const modal = await Modal.create({
            component: InvitationFeedbackPage,
            componentProps: { invitation }
        });
        modal.present();
        const { data } = await modal.onDidDismiss();
        if (data && data.refresh) {
            loadInvitationDetail();
        }*/
            setInvitationStatus(3)
        setFeedbackOpen(true);
    };

    const reject = async () => {
        /*const invitation = { ...model, invitation_status: 2 }; // reject
        const modal = await Modal.create({
            component: InvitationFeedbackPage,
            componentProps: { invitation }
        });
        modal.present();
        const { data } = await modal.onDidDismiss();
        if (data && data.refresh) {
            loadInvitationDetail();
        }*/
            setInvitationStatus(2)
            setFeedbackOpen(true);
    };

    const onFeedbackClose = (refresh: boolean) => {
        
        if (refresh)
            loadInvitationDetail();

        setFeedbackOpen(false);
    }

    return (
        <Suspense fallback={<Loading />}>  
            <DashLayout>
            <div className=' bg-white'>
                <div className="max-w-4xl mx-auto px-6 shadow-[0px_10px_20px_0px_rgba(0,0,0,0.05) xs:pt-0 sm:pt-6 pb-6">

                    <h5 className='text-[color:var(--Neutral-95,#23233D)] text-2xl font-bold leading-8 capitalize'>
                    {model && model.request? model.request.request_position_title: t('Invitation')}
                    </h5>

                </div>    
            </div>
        
            <div className="max-w-4xl mx-auto p-4">
            {loading && <div className="progress-bar">{t("Loading...")}</div>}
            {model && (
                <>
                <p className="font-bold text-base leading-normal">
                    {model.request && model.request.request_position_type === 1
                        ? t("You’d be working full-time as a")
                        : t("You’d be working part-time as a")}
                </p>

                <p className="text-2xl my-2">
                    {model.request && model.request.request_position_title}
                </p>

                <Popover open={companyOpen}>
                    <PopoverTrigger asChild>
                    <p onClick={()=> setCompanyOpen(true)} className="text-[#4c6ff2] cursor-pointer"> 
                        {`${t('At')} ${model.company && model.company.company_common_name_en || 
                            model.company && model.company.company_name},`} 
                    </p>
                    </PopoverTrigger>
                    <PopoverContent className="w-[100%] p-[24px] max-w-[429px] text-[color:var(--Neutral-95,#23233D)] text-center text-base font-normal leading-6">
                            <CompanyPage dismiss={() => setCompanyOpen(false)} company={model.company} />   
                    </PopoverContent>
                </Popover>
            
                { model.request &&  
                    <p className="my-4" dangerouslySetInnerHTML={{ __html: model.request.request_job_description || "" }} />
                }

                {model.request && model.request.request_compensation && (
                    <>
                        <h3 className="font-bold text-lg my-2">{t("Compensation")}</h3>
                        <p className="my-2" dangerouslySetInnerHTML={{ __html: model.request.request_compensation }} />
                    </>
                )}

                <h2 className="font-bold text-lg my-2">{t("Job location")}</h2>

                <p className="my-2">
                    {model.request && model.request.request_location}</p>

                {model.request && model.request.requestSkills && model.request.requestSkills.length > 0 && (
                    <>
                        <h2 className="font-bold text-lg my-2">{t("Skills")}</h2>
                        {model.request.requestSkills.map((skill) => (
                            <span key={skill.skill} className="badge">{skill.skill}</span>
                        ))}
                    </>
                )}

                {(model.request.request_status == 'started' || model.request.request_status == 're_work' || 
                    model.request.request_status == 'finished_by_recruitment') && (
                    <>
                        {model.invitation_status === 1 && (
                            <div className='mt-4'>
                                {/*
                                <Button className="btn-apply w-52 h-11 rounded  mx-0 my-5" variant={"link"}>
                                    More about company
                                </Button> */}

                                <Button onClick={accept} className="">{t("I’d like to apply")}</Button>
                                <Button onClick={reject} className="" variant={"secondary"}>Reject</Button>

                                <Popover open={feedbackOpen} modal={true}>
                                    <PopoverTrigger asChild={false}></PopoverTrigger>
                                    <PopoverContent className="w-[100%] p-[24px] max-w-[429px] text-[color:var(--Neutral-95,#23233D)] text-center text-base font-normal leading-6">
                                        <FeedbackPage onClose={(refresh) => onFeedbackClose(refresh)} invitation={model} 
                                            invitation_status={invitationStatus} />   
                                    </PopoverContent>
                                </Popover>
                                
                            </div>
                        )}

                        {model.invitation_status == 3 && (
                        <div className='mt-4'>
                            <h3>
                                { t("You applied for it with the message:") }
                            </h3>
                            {
                                model.note && <p> 
                                    "<span dangerouslySetInnerHTML={{ __html: model.note.note_text }}></span>"
                                </p>
                            }    

                            <div className="msg flex items-center my-4">
                                <div className="w-1/6 sm:w-1/6 md:w-1/12 lg:w-1/12">
                                    <img src="/assets/images/applied.svg" alt="Applied" className="w-5 h-7" />
                                </div>
                                <div className="w-5/6 sm:w-5/6 md:w-10/12 lg:w-10/12">
                                    <span className="text-black text-sm">
                                        { t("We're now working on convincing them to hire you. Check back here later to see if you made it.")}
                                    </span>
                                </div>
                            </div> 
                        </div>)}
            
                        {model.invitation_status == 2 && (     
                            <div className='mt-4'>
                            <h3>
                            { t("You rejected it with the message:") }
                            </h3>
                            {
                                model.note && <p> 
                                    "<span dangerouslySetInnerHTML={{ __html: model.note.note_text}}></span>"
                                </p>
                            }    

                            <div className="msg flex items-center my-4">
                                <div className="w-1/6 sm:w-1/6 md:w-1/12 lg:w-1/12">
                                    <img src="/assets/images/applied.svg" alt="Applied" className="w-5 h-7" />
                                </div>
                                <div className="w-5/6 sm:w-5/6 md:w-10/12 lg:w-10/12">
                                    <span className="text-black text-sm">
                                        { t("We’ll keep you updated on any other jobs that pop up.") }
                                    </span>
                                </div>
                            </div> 
                        </div>)}
                    </>
                )}

                {(model.request.request_status == 'delivered' || model.request.request_status == 'cancelled') && (
                    <>
                        {model.invitation_status === 1 && (
                            <div>
                                <h3 className="font-bold">
                                    {t("You didn’t apply for it")}
                                </h3>
                            </div>
                        )}

                        {model.invitation_status === 2 && (
                            <div>
                                <h3 className="font-bold">
                                    {t("You rejected it with the message")}:
                                </h3>
                                {model.note && (
                                    <p className="application-msg">
                                        "<span dangerouslySetInnerHTML={{ __html: model.note.note_text }}></span>"
                                    </p>
                                )}
                            </div>
                        )}

                        {model.invitation_status === 3 && (
                            <div>
                                <h3 className="font-bold">
                                    {t("You applied for it with the message")}:
                                </h3>
                                {model.note && (
                                    <p className="application-msg">
                                        "<span dangerouslySetInnerHTML={{ __html: model.note.note_text }}></span>"
                                    </p>
                                )}
                            </div>
                        )}

                        { model.request.request_status == 'delivered' && <div className="msg request-completed">
                            <div className="flex items-center">
                                <div className="w-1/6">
                                    <img src="/assets/images/request-completed.svg" alt="Request Completed" />
                                </div>
                                <div className="w-5/6">
                                    <span className="text-sm">
                                        {t("This job has filled up. If you didn’t make it, we’ll be working on finding you other jobs.")}
                                    </span>
                                </div>
                            </div>
                        </div> }

                        { model.request.request_status == 'cancelled' && <div className="msg request-completed">
                            <div className="flex items-center">
                                <div className="w-1/6">
                                    <img src="/assets/images/request-completed.svg" alt="Request Completed" />
                                </div>
                                <div className="w-5/6">
                                    <span className="text-sm">
                                        {t("This job was cancelled. They’ll hopefully have another opening soon.")}
                                    </span>
                                </div>
                            </div>
                        </div> }
                    </>
                )}
                </>
            )}    
            </div> 
            </DashLayout>
        </Suspense>
    );
};

export default InvitationDetailPage;