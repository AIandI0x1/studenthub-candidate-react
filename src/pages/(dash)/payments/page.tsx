"use client"
import Pager from '@/components/common/pager';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
// app/(dash)/payments/PaymentsPage.jsx

import { Salary } from '@/models/salary';
import { page, track } from '@/providers/analytics.service';
import { listSalary, profile, profileWithBank } from '@/providers/logged-in/account.service';
import { setUser } from '@/store/slices/userSlice';
import { useAppSelector } from '@/store/store';
import { useAppDispatch } from '@/store/store';
import { Link } from 'react-router-dom';   
import { useIonRouter } from '@ionic/react';
import React, { Suspense, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Loading from './loading';
import { dateTimeFormat } from '@/utils/common';

const PaymentsPage = () => {
    
    const [salaries, setSalaries] = useState<Salary[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useIonRouter();

    const [pagination, setPagination] = useState({
        current_page: 1,
        total_pages: 1,
    });

    const { user } = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();

    const { t } = useTranslation();

  useEffect(() => {
    if (!user) {

      setLoading(true);

      profile().then(res => {
        dispatch(setUser({ user: res }));
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [user]);

    useEffect(() => {
        loadData();

        page('Payments Page');

        //router.prefetch('/payments/[id]')

        return () => {
            track('page_exit', { page: 'Payments Page' });
        }
    }, []);

    const loadData = async (page = 1) => {
        setLoading(true);
        const response = await listSalary(page);
        setSalaries(response.data);

        setPagination({
            current_page: parseInt(response.headers.get('x-pagination-current-page')),
            total_pages: parseInt(response.headers.get('x-pagination-page-count'))
        });

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

    loadData(page);
  }
 
    return (
        <Suspense fallback={<Loading />}>  
        <div className=' bg-white'>
            <div className="max-w-4xl mx-auto px-6 shadow-[0px_10px_20px_0px_rgba(0,0,0,0.05) xs:pt-0 sm:pt-6 pb-6">

                <h5 className='text-[color:var(--Neutral-95,#23233D)] text-2xl font-bold leading-8 capitalize'>
                { t('Payments')}
                </h5>

            </div>    
        </div>
        <div className="max-w-4xl mx-auto p-6">
            {loading && <div>{t("Loading...")}</div>}
            {user && (
                <>
                    <h1 className="text-2xl font-bold">{!user.bank_id ? t("Bank Information") : t("Payments")}</h1>

                    {!user.bank_id && (
                        <h3 className='mt-1'>{t("We'll need your bank information to pay you for work done")}</h3>
                    )}
                    {user.bank_id && salaries.length === 0 && (
                        <h3 className='mt-1'>{t("We'll be making payments to the following bank account")}</h3>
                    )}

                    <Link to="/bank"> 
                    <Button className="btn mt-2 mb-4">
                        {t("Enter Bank Information")}
                    </Button>
                    </Link>
                    {salaries.length > 0 && (
                        <div className="salaries">
                            
                            {salaries.map((salary: any) => (
                                <Card 
                                    key={salary.tc_id} 
                                    onClick={() => router.push('/payments/' + salary.tc_id)}
                                    className={`cursor-pointer salary-card ${salary.status === 'Unpaid' ? 'border-l-4 border-yellow-400' : 'border-l-4 border-green-500'} shadow-md bg-white rounded-md my-4`}
                                >
                                    <CardContent className="p-6">  
                                        <span className="text-black text-sm">{dateTimeFormat(salary.tc_created_at || '', 'MMMM d, yyyy')}</span>
                                        <p className="text-black text-lg font-medium">
                                            {salary.hours > 0 && <span>{salary.hours} {t("hours")} </span>}
                                            {salary.minutes > 0 && <span>{salary.minutes} {t("minutes")} </span>}
                                            {salary.seconds > 0 && <span>{salary.seconds} {t("seconds")} </span>}
                                            x {salary.candidate_hourly_rate.toFixed(3)} {t("per hour")}
                                            {salary.candidate_bonus > 0 && <span>+ {salary.candidate_bonus.toFixed(3)} {salary.currency_code} {t("bonus")}</span>}
                                        </p>
                                        <p className="text-black text-2xl font-semibold">{salary.candidate_total.toFixed(3)} {salary.currency_code}</p>
                                        <p className="font-bold text-black mb-4">{t("Transfer pending from")} {salary.company_name}</p>
                                        {salary.status === 'Unpaid' && <p className="text-black text-xs">
                                            {t("Transfer pending, please contact us if you don’t receive it")}    
                                        </p>}
                                        {salary.status === 'Paid' && (
                                            <div>
                                                <span>{t("Transferred to")}</span>
                                                {salary.bank && <span>{salary.bank.bank_name}</span>}
                                                <span>{salary.transfer_benef_name}</span>
                                                <span>{salary.transfer_benef_iban}</span>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}


                            <Pager pagination={pagination} loadPage={loadPage} />

                        </div>
                    )}
                </>
            )}
        </div>
        </Suspense>
    );
};

export default PaymentsPage;