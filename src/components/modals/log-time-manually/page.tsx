
// app/(dash)/log-time-manually/page.tsx
//import { IonDatetime } from '@ionic/react';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next'; // Assuming you have a translation hook
import { useForm } from 'react-hook-form'; // Assuming you're using react-hook-form for form handling
import { addWorkingHour } from '@/providers/logged-in/candidate-working-hour.service';
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
import { FormTimeInput } from '@/components/ui/form-time';
import { t } from 'i18next';
import { toast } from '@/hooks/use-toast';
import { alertDialog } from '@/hooks/use-alert-dialog';
import { FormDateTimeInput } from '@/components/ui/form-datetime';


const timeComparisonValidator = (data: any) => {
  const { start_time, end_time } = data;
  if (start_time && end_time && start_time >= end_time) {
    return false;
  }
  return true;
};
 
const formSchema = z.object({
  start_time: z.string({
    required_error: t('Please add start time.')
  }),
  end_time: z.string({
    required_error: t('Please add end time.')
  }),
  note: z.string({
    required_error: t('Please add notes.')
  }),
  date: z.date({
    required_error:t( 'Please add date.')
  }).max(new Date(), {
    message: t("Can not add future dates."),
  })
 // dateFormatted: z.string({
   // required_error: 'Please add date.'
  //})
});/*.refine(data => timeComparisonValidator(data), {
  message: "Start time should be less than end time.",
});*/
  
const LogTimeManuallyPage = ({ onClose }: {onClose: any}) => {
  const { t } = useTranslation();
  const { reset } = useForm();
  const [saving, setSaving] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
     // end_time: "00:00 AM"
    },
  })

  useEffect(() => {

    // Analytics tracking
    
    page('Log Time Manually Page');

    return () => {
      track('page_exit', { page: 'Log Time Manually Page' });
    }
  }, []);

  async function onSubmit(values: z.infer<typeof formSchema>) {
 
    setSaving(true);

    const params = {
      ...values, 
      date : values.date.toISOString()// dateTimeFormat(values.date, "yyyy-m-d")
    }
 
    const response = await addWorkingHour(params);
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

        h-[480px] bg-white xs:rounded-tl-[30px] xs:rounded-tr-[30px]">
 
        <div className='p-6 border-b border-[color:var(--Neutral-40,#E2E2E6)]'>
          <h5 className=" text-[#22223d] text-xl font-bold leading-7">
            {t("Log Time")}

            <button onClick={() => onClose()} className='bg-[#f5f5f7] rounded-full w-10 h-10 p-2 items-center text-center float-end'>
              <X className="h-6 w-6 fill-[#7d7d8d] text-[#7d7d8d]" aria-hidden="true" />
            </button>
          </h5>
        </div>
        <div className='p-6'>
         
      
          <Form {...form} >
            <form suppressHydrationWarning={true} onSubmit={form.handleSubmit(onSubmit)} 
              className="space-y-4 max-w-[560px] m-auto">
      
              <div className="grid grid-cols-2 gap-4 mb-4">
                <FormTimeInput
                    name="start_time"
                    label="Check-in"
                    form={form as any}
                  />
               
                <FormTimeInput
                    name="end_time"
                    label="Check-out"
                    form={form as any}
                  /> 
              </div>

              <FormTextarea
                name="note"
                label="Notes"
                form={form as any}
              />
 
              <FormDateTimeInput
                name="date"
                label="Select date"
                form={form as any}
            />
            {/*}
              <FormDateInput
              name='date'
              label='Select date'
              form={form as any}
              onChange={(date: any) => {
                console.log(date)
              }}
              />*/}
               
{/** todo: || !form.formState.isValid || !form.formState.isDirty */}
              <button
                type="submit"
                className="disabled:opacity-70 text-[color:var(--Neutral-0,#FFF)] text-base font-semibold leading-6 w-full h-14 shrink-0 [background:var(--Primary-Main,#4C70F2)] rounded-xl"
                disabled={saving }
              >
                {saving ? <Spinner /> : t("Submit Time")}
              </button>
            </form>
          </Form>
 
        </div>
      </div>    
    </div>
  );
};

export default LogTimeManuallyPage;