

import { OnboardProgress } from "@/components/on-board/progress";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
import {
  Form
} from "@/components/ui/form"
import OnboardFooter from "@/components/on-board/layout/footer";
import SubmitButton from "@/components/ui/submit-button";

import { Suspense, useEffect, useState } from "react";
import { profile, updateObjective } from "@/providers/logged-in/account.service";
import { errorMessage, useQuery } from "@/utils/common";
import { useIonRouter } from "@ionic/react"; 
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setUser } from "@/store/slices/userSlice";
import { FormTextarea } from "@/components/ui/form-textarea";
import { page, track } from "@/providers/analytics.service";
import { alertDialog } from "@/hooks/use-alert-dialog";
import { useTranslation } from "react-i18next";
import Loading from "./loading";
import AuthLayout from "../layout";

export default function ObjectivePage() {

  const [loading, setLoading] = useState(false);
  const { user } = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();
  const router = useIonRouter();
  const query = useQuery();

  const { t } = useTranslation();

  // 1. Define your form.

  const formSchema = z.object({
    objective: z.string({
        required_error: t('Please add objective note')
    })
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      objective: user?.candidate_objective || "",
    },
  })

  useEffect(() => {

    page('Objective Page');

    /*if (query.get('fromProfile'))
      //router.prefetch('/profile');
    else
      //router.prefetch('/video');*/

    return () => {
        track('page_exit', { page: 'Objective Page' });
    }
  }, []);

  useEffect(() => {
    if (!user) {

      setLoading(true);

      profile().then(res => {
        dispatch(setUser({ user: res }));
        form.setValue('objective', res.candidate_objective || "");
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [user]);
  
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    
    setLoading(true);

    updateObjective(values.objective).then(res => {
      if (res.operation == 'success') {

        if (user) {
          dispatch(setUser({ user: {
            ...user,
            candidate_objective: values.objective
          } }));
        }

        if (query.get('fromProfile'))
          router.push('/profile');
        else
        router.push('/video');
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
      { !query.get('fromProfile') && <OnboardProgress arrProgress={[100, 100, 48]}></OnboardProgress> }

      <h5 className="mt-[102px] mb-[0px] text-center text-[40px] font-bold leading-[56px]">
        {t("What’s your objective?")}
      </h5>

      <p className="text-[#4B4B61] text-center text-base font-normal leading-6 mb-[40px] mt-[8px]">
        {t("Tell us a bit about what you hope to achieve")}
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-[560px] m-auto mb-[100px]">

          <FormTextarea
            label=""
            name="objective"
            placeholder={t("Small brief about yourself")}
            form={form as any}
          />

          <SubmitButton disabled={!form.formState.isValid || loading } loading={loading}></SubmitButton>
          
        </form>
      </Form>

      <OnboardFooter></OnboardFooter>
      </AuthLayout>
    </Suspense>
  );
}
