import { useState } from 'react';
import { useTranslation } from 'react-i18next'; // Assuming you're using react-i18next for translations
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';
import { updateJobSearchStatus } from '@/providers/logged-in/account.service';
import { setUser } from '@/store/slices/userSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { useHistory } from 'react-router-dom';
import { Candidate } from '@/models/candidate';
import { Card, CardContent } from '@/components/ui/card';


const AccountStatus = () => {
    
    const { t } = useTranslation();
    const [updating, setUpdating] = useState(false);
    const dispatch = useAppDispatch();
    const { user } = useAppSelector(state => state.user) as { user: Candidate };
    const router = useHistory();

    /*useEffect(() => {
        const startWorkSubscription = startWork$.subscribe(() => startWorking());
        const stopWorkSubscription = stopWork$.subscribe(() => stopWorking());
        const workStoppedSubscription = workStopped$.subscribe(() => {
            dispatch(setUser({ user: {
                ...user,
                isWorking: null
            } }));
        });

        return () => {
            startWorkSubscription.unsubscribe();
            stopWorkSubscription.unsubscribe();
            workStoppedSubscription.unsubscribe();
        };
    }, []);*/

    const updateJobSearchStatusClicked = () => {
        const params = {
            job_search_status: user?.candidate_job_search_status === 1 ? 0 : 1
        };

        setUpdating(true);
 
        dispatch(setUser({ user: {
            ...user,
            candidate_job_search_status: params.job_search_status
        } }));

        updateJobSearchStatus(params).then((data: any) => {
            setUpdating(false);
            if (data.operation !== 'success') {
                dispatch(setUser({ user: {
                    ...user,
                    candidate_job_search_status: !params.job_search_status
                } })); // revert status
            }
        }).catch(() => {
            setUpdating(false);
        });
    };

    //todo: test ui
    const viewCompanyDetails = () => {
        router.push(`/company/${user?.company?.company_id}`);
    };
 
    return (
        <div className="account-status">
            <div className='text-[#22223d] text-2xl leading-loose mb-4'>
                <span className=" font-normal ">
                    { t("Hello")},
                    </span>
                    <span className=" font-bold"> { transform(user?.candidate_name || '') }</span>
            </div>
 
            <Card className="p-0 mb-4">
            <CardContent className='p-4'>      
                {user?.store ? (
                    <>
                        <p className="mt-[2px] mb-4 text-sm font-normal leading-tight" dangerouslySetInnerHTML={{ 
                            __html: t('txt_assigned', { 
                                company: user?.company?.company_name, 
                                store: user?.store?.store_name }) }} />
                        <Button variant={"outline"} onClick={viewCompanyDetails} className="btn-learn-more">
                            {t('txt_learn_more', { company: user?.company?.company_name })}
                        </Button>
                    </>
                ) : user?.candidate_job_search_status ? (
                    <>
                        <p className="mt-[2px] mb-4 text-sm font-normal leading-tight">{
                            t("We’re currently looking for a job for you. We’ll notify you when we find an open position.")}
                        </p>
                        <p className="mt-[2px] mb-4 text-sm font-normal leading-tight">{
                            t("The more attractive your profile, the easier it is for us to find you a job.")
                        }</p>
                        <Link to="/profile">
                            <Button variant={"outline"} className="btn-view-profile">{
                                t("View my profile")
                            }</Button>
                        </Link>
                    </>
                ) : (
                    <>
                        <p className="mt-[2px] mb-4 text-sm font-normal leading-tight">{
                        t("You told us you’re not looking for a job, so we’re not going to bother you about it")
                        }</p>
                        <Button variant={"outline"} className="btn-toggle-job" disabled={updating} onClick={updateJobSearchStatusClicked}>{
                            t("I want a job. Sign me up again.")}
                        </Button>
                    </>
                )}
            </CardContent>
            </Card>
        </div>
    );
};

const transform = (val: string) => {
    return val ? val.split(' ')[0] : '';
};

export default AccountStatus;