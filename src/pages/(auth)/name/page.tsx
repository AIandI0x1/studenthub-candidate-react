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
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setUser } from "@/store/slices/userSlice";
import { useIonRouter } from "@ionic/react"; 
import { profile } from "@/providers/logged-in/account.service";
import { page, track } from "@/providers/analytics.service";
import { useTranslation } from "react-i18next";
import Loading from "./loading";
import { useQuery } from "@/utils/common";
import AuthLayout from "../layout";

export default function NamePage() {

  const { user } = useAppSelector(state => state.user);
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);

  const dispatch = useAppDispatch();
  const router = useIonRouter();

  const [loading, setLoading] = useState(false);
  const query = useQuery();

  const { t } = useTranslation();

  // 1. Define your form.

  const formSchema = z.object({
    name_en: z.string().min(2, {
      message: t("Name in English must be at least 2 characters."),
    }),
    name_ar: z.string().min(2, {
      message: t("Name in Arabic must be at least 2 characters."),
    }),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name_en: user?.candidate_name || "",
      name_ar: user?.candidate_name_ar || "",
    },
  })


  useEffect(() => {

    page('Name Page');

    /*if (match && match.params.fromProfile)
      //router.prefetch('/profile');
    else
      //router.prefetch('/email');*/

    return () => {
        track('page_exit', { page: 'Name Page' });
    }
  }, []);

  useEffect(() => {
    if (!user && isAuthenticated) {

      setLoading(true);

      profile().then(res => {
        dispatch(setUser({ user: res }));
        form.setValue('name_en', res.candidate_name || "");

        form.setValue('name_ar', res.candidate_name_ar || "");
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [user, isAuthenticated]);
  
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    //setLoading(true); 

    dispatch(setUser({
      user: {
        candidate_name: values.name_en,
        candidate_name_ar: values.name_ar,
      }
    }));

    if (query.get('fromProfile'))
      router.push('/profile');
    else
      router.push("/email");
  } 

  return (
    <Suspense fallback={<Loading />}> 
    <AuthLayout>  
      { !query.get('fromProfile') && <OnboardProgress arrProgress={[11, 0, 0]}></OnboardProgress> }

      <h5 className="mt-[102px] mb-[40px] text-center text-[40px] font-bold leading-[56px]">
        {t("What’s your name, hero?")}
      </h5>

      <Form {...form} >
        <form suppressHydrationWarning={true} onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-[560px] m-auto mb-[100px]">

          <FormInput
            name="name_en"
            label="Name in English"
            form={form as any}
          />

          <FormInput 
            name="name_ar"
            label=" الإسم بالعربي"
            form={form as any}
            helper="It should match what’s on your civil ID."
            inputDir="rtl"
          />

          <SubmitButton disabled={!form.formState.isValid || loading } loading={loading}>
          </SubmitButton>  
          
        </form>
      </Form>

      <OnboardFooter></OnboardFooter>
    </AuthLayout>  
    </Suspense>
  );
}
