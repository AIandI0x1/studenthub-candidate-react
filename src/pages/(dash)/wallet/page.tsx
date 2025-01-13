"use client"

import Pager from '@/components/common/pager';
// app/(dash)/wallet/WalletBalanceListPage.tsx

import { page, track } from '@/providers/analytics.service';
import { requestUpdated$ } from '@/providers/event.service';
import { payableList } from '@/providers/logged-in/balance.service';
import React, { useEffect, useState, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import Loading from './loading';
import { dateTimeFormat } from '@/utils/common';
import DashLayout from '../layout';

const WalletBalanceListPage = () => {

    const [loading, setLoading] = useState(false);
    const [balances, setBalances] = useState<any[]>([]);
    
    const [pagination, setPagination] = useState({
        current_page: 1,
        total_pages: 1,
    });

    const { t } = useTranslation();
    
    useEffect(() => {
        page('Wallet Balance List');
        loadData();
        const subscription = requestUpdated$.subscribe(() => {
            loadData();
        });
        return () => {
            subscription.unsubscribe();
            track('page_exit', { page: 'Wallet Balance List' });
        };
    }, []);

    const loadData = async (page = 1) => {
        setLoading(true);
        const response = await payableList(page);
        setLoading(false);

        setPagination({
            current_page: parseInt(response.headers.get('x-pagination-current-page')),
            total_pages: parseInt(response.headers.get('x-pagination-page-count'))
        });

        setBalances(response.data);
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

    const positive = (value: number) => Math.abs(value);

    return (
        <Suspense fallback={<Loading />}> 
        <DashLayout>  
        <div className=' bg-white'>
            <div className="max-w-4xl mx-auto px-6 shadow-[0px_10px_20px_0px_rgba(0,0,0,0.05) xs:pt-0 sm:pt-6 pb-6">

                <h5 className='text-[color:var(--Neutral-95,#23233D)] text-2xl font-bold leading-8 capitalize'>
                { t('Wallet')}
                </h5>

            </div>    
        </div>
        
        <div className="max-w-4xl mx-auto p-4"> 
            
            {loading && <div className="progress-bar">{t("Loading...")}</div>}
            <h2 className="font-semibold text-lg mt-6">{t("Wallet Balance")}</h2>

            {balances.length > 0 ? (
                balances.map((balance) => (
                    <div key={balance.id} className="bg-white shadow-md rounded-lg p-4 mb-4">
                        <p>
                            <strong>{balance.amount < 0 ? t("Debit:") : t("Credit:")}</strong> 
                            {positive(balance.amount).toLocaleString('en-US', { style: 'currency', currency: 'KWD' })}
                        </p>
                        <p><strong>{t("Balance:")}</strong> {balance.balance.toLocaleString('en-US', { style: 'currency', currency: 'KWD' })}</p>
                        <p><strong>{t("Note:")}</strong> {balance.data}</p>
                        <p><strong>{t("Created At:")}</strong> 
                            {dateTimeFormat(balance.created_at || '', 'MMMM d, yyyy')}</p>
                        <p><strong>{t("Transaction time:")}</strong> 
                            {dateTimeFormat(balance.transaction_datetime || '', 'MMMM d, yyyy')}
                        </p>
                    </div>
                ))
            ) : (
                <p className="text-center">{t("No record found")}</p>
            )}

            <Pager pagination={pagination} loadPage={loadPage} />

        </div>
        </DashLayout>
        </Suspense>
    );
};

export default WalletBalanceListPage;