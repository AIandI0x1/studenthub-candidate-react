"use client"
// app/(dash)/invitations/InvitationsPage.jsx

import Invitation from '@/components/app/invitation';
import NoItems from '@/components/common/no-items';
import Pager from '@/components/common/pager';
import { Invitation as InvitationModel } from '@/models/invitation';
import { page, track } from '@/providers/analytics.service';
import { requestUpdated$ } from '@/providers/event.service';
import { listInvitations } from '@/providers/logged-in/invitation.service';
import { t } from 'i18next';
import React, { Suspense, useEffect, useState } from 'react';
import Loading from './loading';
import DashLayout from '../layout';


const InvitationListPage = () => {
    const [loading, setLoading] = useState(false);
    const [invitations, setInvitations] = useState<InvitationModel[]>([]);

    const [pagination, setPagination] = useState({
        current_page: 1,
        total_pages: 1,
    });

    useEffect(() => {
        
        loadInvitations();

        const subscription = requestUpdated$.subscribe(() => {
            loadInvitations();
        });

        page('Invitation List page');
        
        return () => {
            subscription.unsubscribe();
            track('page_exit', { 'page': 'Invitation List page' });
        };
    }, []);

    const loadInvitations = async (page = 1) => {
        setLoading(true);
        const data = await listInvitations(page);
        setInvitations(data);
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

    loadInvitations(page);
  }

    return (
        <Suspense fallback={<Loading />}>  
            <DashLayout>
            <div className=' bg-white'>
            <div className="max-w-4xl mx-auto px-6 shadow-[0px_10px_20px_0px_rgba(0,0,0,0.05) xs:pt-0 sm:pt-6 pb-6">

                <h5 className='text-[color:var(--Neutral-95,#23233D)] text-2xl font-bold leading-8 capitalize'>
                { t('Invitations')}
                </h5>

            </div>    
            </div>
        
            <div className="max-w-4xl mx-auto p-6 w-full">
                
                {loading && <div className="progress-bar">{t("Loading...")}</div>}
                <div className="flex flex-col">
                    {invitations.map((invitation: any) => (
                        <Invitation key={invitation.id} model={invitation} />
                    ))}
                    {!loading && invitations.length === 0 && (
                        <NoItems image="assets/icons/no-invitation.svg" 
                            title={ t('There are no assignments yet!') }
                            message={ t('Our team is working hard to find you the suitable assigment for you. Stay tight!') } />
                    )}
                </div>
                
                <Pager pagination={pagination} loadPage={loadPage} />

            </div>
            </DashLayout>
        </Suspense>
    );
};

export default InvitationListPage;
