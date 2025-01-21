
 
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
import { errorMessage, useQuery } from "@/utils/common";
import { useIonRouter } from "@ionic/react";
import { useAppDispatch } from "@/store/store";
import { resetPasswordRequest } from "@/providers/auth.service";
import { page, track } from "@/providers/analytics.service";
import { alertDialog } from "@/hooks/use-alert-dialog";
import { useTranslation } from "react-i18next";
import Loading from "./loading";
import AuthLayout from "../layout"


declare let grecaptcha: any;

export default function ForgotPasswordPage() {
  
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const router = useIonRouter();
  const query = useQuery();

  const formSchema = z.object({
    email: z.string({
      required_error: t('Please add email address.')
      })
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        email: "",
    },
  })

  useEffect(() => {

    page('Forgot Password Page');

    //router.prefetch('/login');
    
    return () => {
        track('page_exit', { page: 'Forgot Password Page' });
    }
  }, []);

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    
    setLoading(true);

    grecaptcha.ready(() => {
        grecaptcha.execute('6Lei9R4pAAAAAEJYoXxoIvP2Uu0oq8iXkCVfmy6V', {action: 'submit'}).then((token: string) => {
           
            resetPasswordRequest(values.email, token).then(res => {
                if (res.operation == 'success') {
                  alertDialog({
                    title: t("Success"),
                    description: res.message,
                  });//'Password recovery email sent, please check your email.'
                  router.push('/login');
                } else {
                    alertDialog({
                      title: t("Error"),
                      description: errorMessage(res.message),
                    });
                }
            }).finally(() => {
                setLoading(false);
            });
        });
    });
  } 

  return (
    <Suspense fallback={<Loading />}>
      <AuthLayout>  
        <h5 className="mt-[102px] mb-[40px] text-center text-[40px] font-bold leading-[56px]">
            {t("Forgot your password?")}
        </h5>
 
        <Form {...form} >
          <form suppressHydrationWarning={true} onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-[560px] m-auto mb-[100px]">
  
          <FormInput
              name="email"
              label="Email Address"
              form={form as any}
              type="email"
            />
 
            <SubmitButton disabled={!form.formState.isValid || loading } loading={loading}></SubmitButton>
            
          </form>
        </Form>

        <OnboardFooter></OnboardFooter>
      </AuthLayout>
    </Suspense>
  );
}
