"use client"
// app/(dash)/invitation/FeedbackPage.jsx

import { page, track } from '@/providers/analytics.service';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Invitation } from '@/models/invitation';
import { accept } from '@/providers/logged-in/invitation.service';
import { reject } from '@/providers/logged-in/invitation.service';
import { requestUpdated$ } from '@/providers/event.service';
import { Button } from '@/components/ui/button';
import { alertDialog } from '@/hooks/use-alert-dialog';
//import { X } from 'lucide-react';

const FeedbackPage = ({ invitation, invitation_status, onClose }: { 
        invitation: Invitation, invitation_status: number, onClose: (value: boolean) => void }) => {

    const { register, handleSubmit, formState: { errors } } = useForm();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        page('Invitation Feedback page');
        return () => {
            track('page_exit', { 'page': 'Invitation Feedback page' });
        };
    }, []);

    const onSubmit = async (data: any) => {

        if (!invitation) {
            return;
        }

        setLoading(true);
        try {
            let action;
            if (invitation_status === 2) {
                action = await reject(invitation.invitation_uuid || "", data.reason);
            } else {
                action = await accept(invitation.invitation_uuid || "", data.reason);
            }

            requestUpdated$.next({});
            if (action.operation === 'success') {
                onClose(true);
            } else {
                alertDialog({
                    title: t('Error'),
                    description: t('Try Again')
                });
            }
        } catch (error) {
            alertDialog({
                title: t('Error'),
                description: t('An error occurred')
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="">
            
            <div className="title-txt pb-4 pt-0">
                {invitation_status == 3 ? 
                    t("Why do you think you’d be good for this job?") : 
                    t("Why do you feel that this job isn’t good for you?")}
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <textarea
                    placeholder={t('Speak your mind')}
                    {...register('reason', { required: true })}
                    className={`border-4 rounded-lg p-2 w-full ${errors.reason ? 'border-red-500' : 'border-gray-400'}`}
                />
                {errors.reason && <span className="text-red-500">{t('This field is required')}</span>}

                <Button disabled={loading} className="btn-submit float-start">
                    {loading ? <span>{t('Loading...')}</span> : (invitation_status === 2 ? t("Reject") : t("Apply"))}
                </Button>

                <Button onClick={() => onClose(false)} variant={"ghost"} className='float-start'>
                    {t("Cancel")}
                </Button>

                 <div className='clearfix'></div>   
            </form>
        </div>
    );
};

export default FeedbackPage;