

import { Backdrop } from '@/components/common/backdrop';
import {
    Form,
} from "@/components/ui/form"
import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod';
import { FormTextarea } from '@/components/ui/form-textarea';
import { t } from 'i18next';
import { alertDialog } from '@/hooks/use-alert-dialog';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import Spinner from '@/components/common/spinner';
import { JobInterest } from '@/models/job-interest';
import { Job } from '@/models/job';
import { showInterest } from '@/providers/logged-in/job.service';
import { errorMessage } from '@/utils/common';
import { useTranslation } from 'react-i18next';


const formSchema = z.object({
    reason: z.string({
        required_error: t('Please mention the reason.')
    })
});

interface IApply {
    job: Job;
    seen_at?: string;
    onClose: (data: any) => void;
}

export default function Apply({ job, seen_at, onClose }: IApply) {

    const { t } = useTranslation();

    const { reset } = useForm();
    const [saving, setSaving] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "all",
        defaultValues: {
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
 
        setSaving(true);

        let jobInterest = new JobInterest();
        jobInterest.notes = values.reason;
        jobInterest.job_uuid = job.job_uuid;
        jobInterest.seen_at = seen_at || (new Date()).toISOString();

        showInterest(jobInterest).then((res) => {
            setSaving(false);

            if (res.operation == "error") {
                alertDialog({
                    title: t("Error"),
                    description: errorMessage(res.message),
                });
            }
            else {
                reset();
                onClose({
                    refresh: true
                });
            }
        });
    }

    return (
        <div className='inset-0 flex items-center justify-center'>

            <Backdrop onClick={() => { onClose({});  }}></Backdrop>

            <div className="fixed 
                top-[calc(50%-222px)] xs:start-6 w-[calc(100%-48px)] sm:start-[calc(50%-244px)] max-w-[488px] rounded-lg
                 bg-white p-4">

                <div className="block text-[#22223d] text-lg font-bold font-['Inter'] leading-normal pb-4">
                    { t('Why do you think your good for this job?') }
                </div>

                <Form {...form} >
                    <form suppressHydrationWarning={true} onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4">

                        <FormTextarea
                            name="reason"
                            label="E.g: Talk about your skills and what you can offer..."
                            form={form as any}
                        />

                        <button
                            type="submit"
                            className="disabled:opacity-70 text-[color:var(--Neutral-0,#FFF)] text-base font-semibold leading-6 w-full h-14 shrink-0 [background:var(--Primary-Main,#4C70F2)] rounded-xl"
                            disabled={saving || !form.formState.isValid || !form.formState.isDirty}
                        >
                            {saving ? <Spinner /> : t("Apply")}
                        </button>
                    </form>
                </Form>
            </div>
        </div>

    )
}