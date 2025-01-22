
// app/(dash)/payments/PaymentsPage.jsx

import { Salary } from '@/models/salary';
import { page, track } from '@/providers/analytics.service';
import { viewSalary } from '@/providers/logged-in/account.service';
import { useParams } from 'react-router-dom';
import { Suspense, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Loading from '../loading';
import { dateTimeFormat, formatNumber } from '@/utils/common';
import DashLayout from '../../layout';

const PaymentDetailPage = () => {
    
    const [salary, setSalary] = useState<Salary>();
    const [loading, setLoading] = useState(false);
  
    const params = useParams() as { id: string }; 

    const id = params?.id as any;

    const { t } = useTranslation();

    useEffect(() => {
        loadData();

        page('Payment Detail Page');

        return () => {
            track('page_exit', { page: 'Payment Detail Page' });
        }
    }, []);

    const loadData = async (refresh = false) => {
        setLoading(true);
        const response = await viewSalary(id);
        setSalary(response);
        setLoading(false);
    };
 
    return (
        <Suspense fallback={<Loading />}>  
            <DashLayout>
            <div className=' bg-white'>
                <div className="max-w-4xl mx-auto px-6 shadow-[0px_10px_20px_0px_rgba(0,0,0,0.05) xs:pt-0 sm:pt-6 pb-6">

                    <h5 className='text-[color:var(--Neutral-95,#23233D)] text-2xl font-bold leading-8 capitalize'>
                    { t('Payment details')}
                    </h5>

                </div>    
            </div>
            <div className="max-w-4xl mx-auto p-4">
                
                {loading && <div>{t("Loading...")}</div>}

                {salary &&
                <div>
                    <div className="text-[#22223d] text-lg font-semibold leading-7 mb-4">
                        {t("Transfer Details")}
                    </div>
                    <div className="flex-row">
                        <div className='p-4 flex-row border-b'>
                            <span className='text-[color:var(--Neutral-90,#4B4B61)] text-sm font-normal leading-5'>
                                {t("Employer")}
                            </span>
                            <span className='w-[271px] text-[color:var(--Neutral-100,#0F0F2C)] text-end float-end text-sm font-normal leading-5'>
                                {salary.company_name}
                            </span>
                        </div>
                    </div>

                    <div className="flex-row">
                        <div className='p-4 flex-row border-b'>
                            <span className='text-[color:var(--Neutral-90,#4B4B61)] text-sm font-normal leading-5'>
                            {t("Bank")}
                            </span>
                            <span className='w-[271px] text-[color:var(--Neutral-100,#0F0F2C)] text-end float-end text-sm font-normal leading-5'>
                            {salary.bank && salary.bank.bank_name}  
                            </span>
                        </div>
                    </div>
                    <div className="flex-row">
                        <div className='p-4 flex-row border-b'>
                            <span className='text-[color:var(--Neutral-90,#4B4B61)] text-sm font-normal leading-5'>
                                {t("Bank IBAN")}
                            </span>
                            <span className='w-[271px] text-[color:var(--Neutral-100,#0F0F2C)] text-end float-end text-sm font-normal leading-5'>
                            {salary.transfer_benef_iban}  
                            </span>
                        </div>
                    </div>
                    
                    <div className="flex-row">
                        <div className='p-4 flex-row border-b'>
                            <span className='text-[color:var(--Neutral-90,#4B4B61)] text-sm font-normal leading-5'>
                            {t("Transferred to")}
                            </span>
                            <span className='w-[271px] text-[color:var(--Neutral-100,#0F0F2C)] text-end float-end text-sm font-normal leading-5'>
                                    {salary.transfer_benef_name} 
                            </span>
                        </div>
                    </div>
                    <div className="flex-row">
                        <div className='p-4 flex-row border-b'>
                            <span className='text-[color:var(--Neutral-90,#4B4B61)] text-sm font-normal leading-5'>
                            {t("Date")}
                            </span>
                            <span className='w-[271px] text-[color:var(--Neutral-100,#0F0F2C)] text-end float-end text-sm font-normal leading-5'>
                            {dateTimeFormat(salary.tc_created_at || '', 'MMMM d, yyyy')}
                            </span>
                        </div>
                    </div>
                    <div className="flex-row">
                        <div className='p-4 flex-row border-b'>
                            <span className='text-[color:var(--Neutral-90,#4B4B61)] text-sm font-normal leading-5'>
                            {t("Amount")}
                            </span>
                            <span className='w-[271px] text-[color:var(--Neutral-100,#0F0F2C)] text-end float-end text-sm font-normal leading-5'>
                            {salary.currency_code} {formatNumber(salary.candidate_total || 0)} 
                            </span>
                        </div>
                    </div>
                    <div className="flex-row">
                        <div className='p-4 flex-row border-b'>
                            <span className='text-[color:var(--Neutral-90,#4B4B61)] text-sm font-normal leading-5'>
                            {t("Status")}
                            </span>
                            <span className='w-[271px] text-[color:var(--Neutral-100,#0F0F2C)] text-end float-end text-sm font-normal leading-5'>
                            { salary.status == 'Unpaid'? t("Pending"): t("Successful")}
                            </span>
                        </div>
                    </div>
        
                </div>    
                }
            </div> 
            </DashLayout>
        </Suspense>
    );
};

export default PaymentDetailPage;