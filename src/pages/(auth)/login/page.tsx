

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
import {
  Form
} from "@/components/ui/form"
import { FormInput } from "@/components/ui/form-input";
import OnboardFooter from "@/components/on-board/layout/footer";
import SubmitButton from "@/components/ui/submit-button";
import { setCredentials } from "@/store/slices/authSlice";
import { useAppDispatch } from "@/store/store";
import { basicAuth } from "@/providers/auth.service";
import { Suspense, useEffect, useState } from "react";
import { setIsProfileCompleted } from "@/store/slices/userSlice";
import { useIonRouter } from "@ionic/react"; 
import { Link } from "react-router-dom";
import { page, track } from "@/providers/analytics.service";
import { useTranslation } from "react-i18next";
import Loading from "./loading";
import AuthLayout from "../layout"
//import { useQuery } from "@/utils/common"


export default function LoginPage() {

  const router = useIonRouter();

  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);

  //const query = useQuery();

  const { t } = useTranslation();

  const formSchema = z.object({
    email: z.string().email(t('Please enter valid email address')),
    password: z.string().min(4, { message: t("Password must be at least 4 characters long") })
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  useEffect(() => {

    page('Login Page');

    //router.prefetch('/home');
     
    return () => {
        track('page_exit', { page: 'Login Page' });
    }
  }, []);

  function onSubmit(values: z.infer<typeof formSchema>) {

    setLoading(true);

    basicAuth(values.email, values.password).then(res => {
 
      // After successful login
      dispatch(setCredentials({
        token: res.token
      }));

      dispatch(setIsProfileCompleted({ 
        isProfileCompleted: res.isProfileCompleted
      }));
 
      //todo: set language based on saved preference?
      //language_pref

      router.push('/home');
      
    }).catch(err => {
     // alert("err:" + err);
    }).finally(() => {
      setLoading(false);
    });
  } 

  return (
    <Suspense fallback={<Loading />}>
      <AuthLayout>  
      <div className="bg-[#fff]">

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
              />

              <FormInput
                name="password"
                label="Password"
                form={form as any}
                type="password"
              />
              <Link to="/forgot-password">
                {t("Forgot Password?")}
              </Link>

              <SubmitButton disabled={!form.formState.isValid || loading } loading={loading}></SubmitButton>
              
            </form>
          </Form>

          <OnboardFooter></OnboardFooter>

      </div>
      </AuthLayout>
    </Suspense>
  );
}
