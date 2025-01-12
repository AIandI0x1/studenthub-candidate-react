"use client"

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
import { profile, updateProfileUrl } from "@/providers/logged-in/account.service";
import { errorMessage, useQuery } from "@/utils/common";
import { useIonRouter } from "@ionic/react"; 
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setUser } from "@/store/slices/userSlice";
import { page, track } from "@/providers/analytics.service";
import { alertDialog } from "@/hooks/use-alert-dialog";
import { useTranslation } from "react-i18next";
import Loading from "./loading";



export default function ProfileUrlPage() {

  const [loading, setLoading] = useState(false);
  const { user } = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();
  const router = useIonRouter();
  const query = useQuery();

  const { t } = useTranslation();

  // 1. Define your form.

  const formSchema = z.object({
    profile_url: z.string({
          required_error: t('Please add profile url.')
      })
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      profile_url: user?.profile_url || "",
    },
  })

  useEffect(() => {

    page('Profile URL Page');

    /*if (query.get('fromProfile'))
      //router.prefetch('/profile');
    else
      //router.prefetch('/complete');*/

    return () => {
        track('page_exit', { page: 'Profile URL Page' });
    }
  }, []);

  useEffect(() => {
    if (!user) {

      setLoading(true);

      profile().then(res => {
        dispatch(setUser({ user: res }));
        form.setValue('profile_url', res.profile_url || "");
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [user]);

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    
    setLoading(true);

    updateProfileUrl(values).then(res => {
      if (res.operation == 'success') {

        if (user) {
          dispatch(setUser({ user: {
            ...user,
            profile_url: values.profile_url
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
        { !query.get('fromProfile') && <OnboardProgress arrProgress={[0, 0, 0]}></OnboardProgress> }

        <h5 className="mt-[102px] mb-[40px] text-center text-[40px] font-bold leading-[56px]">
            {t("Profile Url")}
        </h5>
 
        <Form {...form} >
          <form suppressHydrationWarning={true} onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-[560px] m-auto mb-[100px]">
  
          <FormInput
              name="profile_url"
              label="Profile Url"
              form={form as any}
              type="text"
            />
 
            <SubmitButton disabled={!form.formState.isValid || loading } loading={loading}></SubmitButton>
            
          </form>
        </Form>

        <OnboardFooter></OnboardFooter>
    </Suspense>
  );
}
