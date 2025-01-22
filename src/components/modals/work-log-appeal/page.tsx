
// app/(dash)/log-time-manually/page.tsx
//import { IonDatetime } from '@ionic/react';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next'; // Assuming you have a translation hook
import { useForm } from 'react-hook-form'; // Assuming you're using react-hook-form for form handling
import {  postWorkingHourAppeal } from '@/providers/logged-in/candidate-working-hour.service';
import { X } from 'lucide-react';
import Spinner from '@/components/common/spinner';
import { page, track } from '@/providers/analytics.service';
import { Backdrop } from '@/components/common/backdrop';
import {
  Form,
} from "@/components/ui/form"
import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod';
import { FormTextarea } from '@/components/ui/form-textarea';
import { t } from 'i18next';
import { toast } from '@/hooks/use-toast';
import { alertDialog } from '@/hooks/use-alert-dialog';

 
 
const formSchema = z.object({
  reason: z.string({
    required_error: t('Please mention the reason.')
  })
});
  
const WorkLogAppealPage = ({ onClose, candidate_working_hour_uuid }: {onClose: any, candidate_working_hour_uuid: string}) => {
  const { t } = useTranslation();
  const { reset } = useForm();
  const [saving, setSaving] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { 
    },
  })

  useEffect(() => {

    // Analytics tracking
    
    page('Work Log Appeal Page');

    return () => {
      track('page_exit', { page: 'Work Log Appeal Page' });
    }
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
  
    setSaving(true);
 
    const response = await postWorkingHourAppeal(candidate_working_hour_uuid, values.reason);
    setSaving(false);
 
    if (response.operation === "success") {
      
      toast({
        title: t('Success'),
        description: response.message
      });

      reset(); // Reset the form
      onClose({ refresh: true }); // Close the modal

    } else if (response.operation === "error") {
      
      alertDialog({
        title: t('Error'),
        description: response.message
      });
    }
  };
 
  return (
    <div className='inset-0 flex items-center justify-center'>
      <Backdrop onClick={() => onClose()}></Backdrop>
 
      <div className="fixed 

        xs:bottom-[0] xs:w-full xs:start-0

        sm:top-[calc(50%-222px)] sm:start-[calc(50%-244px)] sm:w-[488px] sm:rounded-[30px]

        h-[370px] bg-white xs:rounded-tl-[30px] xs:rounded-tr-[30px]">
 
        <div className='p-6 border-b border-[color:var(--Neutral-40,#E2E2E6)]'>
          <h5 className=" text-[#22223d] text-xl font-bold leading-7">
            {t("Submit an Appeal")}

            <button onClick={() => onClose()} className='bg-[#f5f5f7] rounded-full w-10 h-10 p-2 items-center text-center float-end'>
              <X className="h-6 w-6 fill-[#7d7d8d] text-[#7d7d8d]" aria-hidden="true" />
            </button>
          </h5>
        </div>
        <div className='p-6'>
         
            <p className=" text-[#7d7d8d] text-sm font-medium leading-none mb-2.5">
            {t('Please provide a reason for your appeal. We will review your case and get back to you.')}
            </p>

          <Form {...form} >
            <form suppressHydrationWarning={true} onSubmit={form.handleSubmit(onSubmit)} 
              className="space-y-4 max-w-[560px] m-auto">
       
                <div className="text-[#22223d] text-sm font-bold leading-tight">
                    {t('Appeal Reason')}
                </div>

              <FormTextarea
                name="reason"
                label="Enter your appeal reason here..."
                form={form as any}
              />
   
              <button
                type="submit"
                className="disabled:opacity-70 text-[color:var(--Neutral-0,#FFF)] text-base font-semibold leading-6 w-full h-14 shrink-0 [background:var(--Primary-Main,#4C70F2)] rounded-xl"
                disabled={saving || !form.formState.isValid || !form.formState.isDirty}
              >
                {saving ? <Spinner /> : t("Submit Appeal")}
              </button>
            </form>
          </Form>
 
        </div>
      </div>    
    </div>
  );
};

export default WorkLogAppealPage;