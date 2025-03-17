

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
import { RootState, useAppDispatch, useAppSelector } from "@/store/store";
import { useIonRouter } from "@ionic/react";
import { createAccount } from "@/providers/auth.service";
import { errorMessage, useQuery } from "@/utils/common";
import { setUnVerifiedToken } from "@/store/slices/authSlice";
import { profile, updateEmail } from "@/providers/logged-in/account.service";
import { setUser } from "@/store/slices/userSlice";
import { page, track } from "@/providers/analytics.service";
import { alertDialog } from "@/hooks/use-alert-dialog";
import { useTranslation } from "react-i18next";
import Loading from "./loading";
import AuthLayout from "../layout";

declare let grecaptcha: any;

export default function EmailPage() {

  const [loading, setLoading] = useState(false);
  
  const dispatch = useAppDispatch();
  const router = useIonRouter();
  
  const { user } = useAppSelector((state: RootState) => state.user);

  const { t } = useTranslation();

  const query = useQuery();
  
  // 1. Define your form.

  const formSchema = z.object({
    email: z.string({
      required_error: t('Please enter email address')
    }).email(t('Please enter valid email address.'))
    .min(1, t('Please enter email address')),
    password: query.get("fromProfile") ? z.string().optional().nullable() : z.string({
      required_error: t("Please enter password")
    }).min(1, t("Please enter password")),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "all",
    //reValidateMode: "onChange",
    defaultValues: {
      password: "",
      email: user?.candidate_new_email || user?.candidate_email || "",
    },
  })

  useEffect(() => {

    page('Email Page');

    //router.prefetch('/login');
    //router.prefetch('/verify-email/[email]');

    return () => {
        track('page_exit', { page: 'Email Page' });
    }
  }, []);

  useEffect(() => {
    if (!user) {
   //  form.setValue('phone', user?.candidate_phone || "");
    //} else {

      setLoading(true);

      profile().then(res => {
        dispatch(setUser({ user: res }));
        form.setValue('email', res.candidate_new_email || res.candidate_email || "");
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [user]);
  
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    
    setLoading(true);

    grecaptcha.ready(() => {
      grecaptcha.execute('6Lei9R4pAAAAAEJYoXxoIvP2Uu0oq8iXkCVfmy6V', {action: 'submit'}).then((token: string) => {

         const params = {
            ...values, 
            name: user?.candidate_name,
            name_ar: user?.candidate_name_ar,
            token: token
         };

         onValidCaptcha(params);
      });
    });  
  }

  function onValidCaptcha(values: any) {

    const fromProfile = parseInt(query.get('fromProfile') || '0');

    const action = fromProfile ? updateEmail(values.email): 
      createAccount(values);

    action.then(res => {

      if (res.operation == 'success') {

        dispatch(setUnVerifiedToken({
          token: res.unVerifiedToken
        }));
      
        const url = fromProfile == 1 ? 
          '/verify-email/' + values.email + '?fromProfile=' + fromProfile : 
          '/verify-email/' + values.email;

        router.push(url);

      } else if (res.operation === 'error') {

        //validation error 

        if(res.code == 2 && res.message.candidate_email) {
          router.push('/login');
        }

        alertDialog({
          title: t("Error"),
          description: errorMessage(res.message),
        });

        /*
        todo: have alert
        this.alertCtrl.create({
          message: this.authService.errorMessage(res.message),
          buttons: [this.translateService.transform('Okay')]
        }).then(alert => {
          alert.present();
        });*/
      }
      
    }).catch(err => {
     // alert("err:" + err);
    }).finally(() => {
      setLoading(false);
    });
  } 

  return (
    <Suspense fallback={<Loading />}>
      <AuthLayout>  
        { !query.get('fromProfile') && <OnboardProgress arrProgress={[22, 0, 0]}></OnboardProgress> }

        <h5 className="mt-[102px] mb-[40px] text-center text-[40px] font-bold leading-[56px]">
          {t("What is your email address?")}
        </h5>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-[560px] m-auto mb-[100px]">
  
            <FormInput
              name="email"
              label="Email Address"
              form={form as any}
              type="email"
              required={true}
            />

            { !query.get('fromProfile') && <FormInput
              name="password"
              label="Password"
              form={form as any}
              type="password"
              required={true}
            /> }
 
            <SubmitButton disabled={!form.formState.isValid || loading } loading={loading}></SubmitButton>
            
          </form>
        </Form>

        <OnboardFooter></OnboardFooter>
      </AuthLayout>
    </Suspense>
  );
}
