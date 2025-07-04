

import { OnboardProgress } from "@/components/on-board/progress";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
import {
  Form
} from "@/components/ui/form"
import { FormInput } from "@/components/ui/form-input";
import OnboardFooter from "@/components/on-board/layout/footer";
import SubmitButton from "@/components/ui/submit-button";

import { Suspense, useEffect, useState } from "react";
import { profile, updatePreferredTime } from "@/providers/logged-in/account.service";
import { errorMessage, useQuery } from "@/utils/common";
import { useIonRouter } from "@ionic/react"; 
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setUser } from "@/store/slices/userSlice";
import { page, track } from "@/providers/analytics.service";
import { alertDialog } from "@/hooks/use-alert-dialog";
import { useTranslation } from "react-i18next";
import Loading from "./loading";
import AuthLayout from "../layout";
import { FormTimeInput } from "@/components/ui/form-time";


export default function PreferredTimePage() {

  const [loading, setLoading] = useState(false);
  const { user } = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();
  const router = useIonRouter();
    const query = useQuery();

  const { t } = useTranslation();

  // 1. Define your form.

  const formSchema = z.object({
    preferred_time: z.string({
          required_error: t('Please add preferred time to contact you.')
      }).min(1, t('Please add preferred time to contact you.'))
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: {
      preferred_time: user?.candidate_preferred_time || "",
    },
  })

  useEffect(() => {

    page('Preferred Time Page');

      /*if (query.get('fromProfile'))
      //router.prefetch('/profile');
    else
      //router.prefetch('/complete');*/

    return () => {
        track('page_exit', { page: 'Preferred Time Page' });
    }
  }, []);

  useEffect(() => {
    if (!user) {

      setLoading(true);

      profile().then(res => {
        dispatch(setUser({ user: res }));
        form.setValue('preferred_time', res.candidate_preferred_time || "");
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [user]);

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    
    setLoading(true);

    updatePreferredTime(values).then(res => {
      if (res.operation == 'success') {

        if (user) {
          dispatch(setUser({ user: {
            ...user,
            candidate_preferred_time: values.preferred_time
          } }));
        }

        if (query.get('fromProfile'))
          router.push('/profile');
        else
          router.push('/complete');
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

  return (
    <Suspense fallback={<Loading />}>
      <AuthLayout>  
        { !query.get('fromProfile') && <OnboardProgress arrProgress={[100, 100, 84]}></OnboardProgress> }

        <h5 className="mt-[102px] mb-[0px] text-center text-[40px] font-bold leading-[56px]">
          {t("When should we contact you?")}
        </h5>

        <p className="text-[#4B4B61] text-center text-base font-normal leading-6 mb-[40px] mt-[8px]">
          {t("We’ll call you for job opportunities whenever you’re available")}
        </p>

        <Form {...form} >
          <form suppressHydrationWarning={true} onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-[560px] m-auto mb-[100px]">
  
          <FormTimeInput
              name="preferred_time"
              label="Preferred Time"
              form={form as any}
              required={true}
            />
 
            <SubmitButton disabled={!form.formState.isValid || loading } loading={loading}></SubmitButton>
            
          </form>
        </Form>

        <OnboardFooter></OnboardFooter>
      </AuthLayout>
    </Suspense>
  );
}
