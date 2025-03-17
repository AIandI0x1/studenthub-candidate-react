

import { OnboardProgress } from "@/components/on-board/progress";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
  Form,
} from "@/components/ui/form"
import OnboardFooter from "@/components/on-board/layout/footer";
import SubmitButton from "@/components/ui/submit-button";
import NationalityInput from "@/components/on-board/nationality-input";
import React, { Suspense } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { profile, updateNationalityWithKuwaitiStatus } from "@/providers/logged-in/account.service";
import { errorMessage, langContent, useQuery } from "@/utils/common";
import { useIonRouter } from "@ionic/react"; 
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setUser } from "@/store/slices/userSlice";
import { page, track } from "@/providers/analytics.service";
import { alertDialog } from "@/hooks/use-alert-dialog";
import { useTranslation } from "react-i18next";
import Loading from "./loading";
import AuthLayout from "../layout";
import { Country } from "@/models/country";
 

export default function NationalityPage() {

  const { t, i18n } = useTranslation();
  
  const [loading, setLoading] = useState(false);
  const { user } = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();
  const router = useIonRouter();
  const query = useQuery();
 
  let [country, setCountry] = React.useState<Country | undefined>(undefined);
 
  // 1. Define your form.

  const formSchema = z.object({
    // nationality: z.string().email('Please enter valid nationality'),
    country_id: z.number({
      required_error: t('Please enter valid nationality')
    }).min(1, t('Please enter valid nationality')),
    candidate_mom_kuwaiti: z.number({
      required_error: t('Please enter valid nationality')
    }).min(1, t('Please enter valid nationality')),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: {
      country_id: user?.country_id || 84,
      candidate_mom_kuwaiti: user?.candidate_mom_kuwaiti || 1,
      // nationality: any
    },
  })

  useEffect(() => {

    page('Nationality Page');

    /*if (query.get('fromProfile'))
      //router.prefetch('/profile');
    else
      //router.prefetch('/area');*/

    return () => {
        track('page_exit', { page: 'Nationality Page' });
    }
  }, []);

  useEffect(() => {
    if (!user) {

      setLoading(true);

      profile().then(res => {
        dispatch(setUser({ user: res }));
        form.setValue('country_id', res.country_id || 84);
        form.setValue('candidate_mom_kuwaiti', res.candidate_mom_kuwaiti || 1);
        setCountry(res.nationality || {
          country_id: 84,
          country_nationality_name_en: "Kuwaiti"
        });
      }).finally(() => {
        setLoading(false);
      });
    } else {
      setCountry(user?.nationality || {
        country_id: 84,
        country_nationality_name_en: "Kuwaiti"
      });
    }
  }, [user]);

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    updateNationalityWithKuwaitiStatus(values.country_id, values.candidate_mom_kuwaiti).then(res => {

      if (res.operation == 'success') {

        dispatch(setUser({ user: {
          ...user,
          candidate_mom_kuwaiti: values.candidate_mom_kuwaiti,
          country_id: res.country.country_id,
          nationality: res.country
        } }));

        if (query.get('fromProfile'))
          router.push('/profile');
        else
          router.push('/area');
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

  function onCountryChange(country: any) {
    form.setValue("country_id", country.country_id);
    setCountry(country);
    //form.setValue("nationality", country);
  }

  return (
    <Suspense fallback={<Loading />}>
      <AuthLayout>  
      { !query.get('fromProfile') && <OnboardProgress arrProgress={[77, 0, 0]}></OnboardProgress> }

      <h5 className="mt-[102px] mb-[40px] text-center text-[40px] font-bold leading-[56px]">
        {t("Tell us more about your nationality")}
      </h5>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-[560px] m-auto mb-[100px]">
       
          <NationalityInput selectedCountry={country} 
            required={true}
            onSelect={(country) => onCountryChange(country)}></NationalityInput>
          
          <p className="text-[color:var(--Neutral-95,#23233D)] text-lg font-semibold leading-7 mb-[0]">
            {t("Is your mother Kuwaiti?")}

            <Popover>
              <PopoverTrigger asChild>
                <Button className="inline relative top-1" variant={'ghost'}>
                  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.49991 0.876892C3.84222 0.876892 0.877075 3.84204 0.877075 7.49972C0.877075 11.1574 3.84222 14.1226 7.49991 14.1226C11.1576 14.1226 14.1227 11.1574 14.1227 7.49972C14.1227 3.84204 11.1576 0.876892 7.49991 0.876892ZM1.82707 7.49972C1.82707 4.36671 4.36689 1.82689 7.49991 1.82689C10.6329 1.82689 13.1727 4.36671 13.1727 7.49972C13.1727 10.6327 10.6329 13.1726 7.49991 13.1726C4.36689 13.1726 1.82707 10.6327 1.82707 7.49972ZM8.24992 4.49999C8.24992 4.9142 7.91413 5.24999 7.49992 5.24999C7.08571 5.24999 6.74992 4.9142 6.74992 4.49999C6.74992 4.08577 7.08571 3.74999 7.49992 3.74999C7.91413 3.74999 8.24992 4.08577 8.24992 4.49999ZM6.00003 5.99999H6.50003H7.50003C7.77618 5.99999 8.00003 6.22384 8.00003 6.49999V9.99999H8.50003H9.00003V11H8.50003H7.50003H6.50003H6.00003V9.99999H6.50003H7.00003V6.99999H6.50003H6.00003V5.99999Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[100%] p-[24px] max-w-[429px] text-[color:var(--Neutral-95,#23233D)] text-center text-base font-normal leading-6">
                <p className="mb-[24px]">{t("This is required for us to know whether we can match you for jobs in the food and beverage sector.")}</p>

                <p className="mb-[24px]">{t("Current Kuwaiti regulations only allow us to issue health cards for Kuwaiti nationals.")}</p>

                <p className="mb-[24px]">{t("This is hopefully temporary as we’re currently working on legalizing health cards for non-Kuwaitis.")}</p>
              </PopoverContent>

            </Popover>
          </p>

          <RadioGroup 
            onValueChange={(value) => form.setValue('candidate_mom_kuwaiti', parseInt(value))} 
            defaultValue={form.getValues('candidate_mom_kuwaiti')?.toString()} 
            className="mt-[0]" 
            dir={i18n.language == 'ar' ? 'rtl' : 'ltr'}
          >
            <div className={ `flex items-center space-x-2` }>
              <RadioGroupItem value="1" id="option-one" className="mx-1" />
              <Label htmlFor="option-one"> {t("Yes")}</Label>
            </div>
            <div className={ `flex items-center space-x-2` }>
              <RadioGroupItem value="2" id="option-two" className="mx-1" />
              <Label htmlFor="option-two">{t("No")}</Label>
            </div>
          </RadioGroup>

          <SubmitButton disabled={!form.formState.isValid || loading } loading={loading}></SubmitButton>
        </form>
      </Form>

      <OnboardFooter></OnboardFooter>
      </AuthLayout>
    </Suspense>
  );
}
