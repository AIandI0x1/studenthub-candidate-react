

//import { OnboardProgress } from "@/components/on-board/progress";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
import {
  Form
} from "@/components/ui/form"
import { FormInput } from "@/components/ui/form-input";
//import OnboardFooter from "@/components/on-board/layout/footer";
import SubmitButton from "@/components/ui/submit-button";

import { Suspense, useEffect, useState } from "react";
import { updateProfileUrl } from "@/providers/logged-in/account.service";
import { errorMessage } from "@/utils/common";
import { useIonRouter } from "@ionic/react";
import { useAppDispatch, useAppSelector } from "@/store/store";
//import { setUser } from "@/store/slices/userSlice";
import { page, track } from "@/providers/analytics.service";
import { alertDialog } from "@/hooks/use-alert-dialog"
import { useTranslation } from "react-i18next"
import Loading from "./loading"
import DashLayout from "../layout"


export default function ChangePasswordPage() {

  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const { user } = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();
  const router = useIonRouter();

  // 1. Define your form.

  const formSchema = z.object({
    oldPassword: z.string({
        required_error: t('Please add old password.')
    }),
    newPassword: z.string({
        required_error: t('Please add new password.')
    })
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: ""
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    
    setLoading(true);

    updateProfileUrl(values).then(res => {
      if (res.operation == 'success') {
        router.push('/profile');
      } else {
        alertDialog({
          title: t("Error"),
          description: errorMessage(res.message),
        });
      }
    }).finally(() => {
      setLoading(false);
    });
  } 

  useEffect(() => {
    page('Change Password Page');

    //router.prefetch('/profile');
    
    return () => {
      track('page_exit', { page: 'Change Password Page' });
    }
  }, []);

  return (
    <Suspense fallback={<Loading />}>
      <DashLayout> 
        <div className=' bg-white'>
            <div className="max-w-4xl mx-auto px-6 shadow-[0px_10px_20px_0px_rgba(0,0,0,0.05) xs:pt-0 sm:pt-6 pb-6">

                <h5 className='text-[color:var(--Neutral-95,#23233D)] text-2xl font-bold leading-8 capitalize'>
                { t('Change Password')}
                </h5>

            </div>    
        </div>
 
        <div className="max-w-4xl mx-auto p-4"> 
 
        <Form {...form} >
          <form suppressHydrationWarning={true} onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-[560px] m-auto mb-[100px]">
  
          <FormInput
              name="oldPassword"
              label="Old Password"
              form={form as any}
              type="text"
            />

          <FormInput
              name="newPassword"
              label="New Password"
              form={form as any}
              type="text"
            />
 
            <SubmitButton disabled={!form.formState.isValid || loading } loading={loading}></SubmitButton>
            
          </form>
        </Form>
        </div>   
        {/*<OnboardFooter></OnboardFooter>*/}
      </DashLayout>
    </Suspense>
  );
}
