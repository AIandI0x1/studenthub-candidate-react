

import { OnboardProgress } from "@/components/on-board/progress";

import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"
 
import {
  Form
} from "@/components/ui/form"
import { FormInput } from "@/components/ui/form-input";
import OnboardFooter from "@/components/on-board/layout/footer";
import SubmitButton from "@/components/ui/submit-button";
import { Button } from "@/components/ui/button";

import { Suspense, useEffect, useState } from "react";
import { profile } from "@/providers/logged-in/account.service";
import { errorMessage, useQuery } from "@/utils/common";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setUser } from "@/store/slices/userSlice";
import { saveExperience } from "@/providers/logged-in/candidate-experience.service";
import { useTranslation } from "react-i18next";
import { page, track } from "@/providers/analytics.service";
import { alertDialog } from "@/hooks/use-alert-dialog";
import Loading from "./loading";
import { useIonRouter } from "@ionic/react";
import AuthLayout from "../layout";
 
export default function ExperiencesPage() {

  const [loading, setLoading] = useState(false);
  const { user } = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();
  const router = useIonRouter();

  const { t } = useTranslation();
  const query = useQuery();
  let formattedExperiences: any[] = [];

  const formSchema = z.object({
    experiences: z.array(z.object({
      candidate_experience_id: z.any().nullable(),
      experience: z.string().max(128).min(1, t('Job title is required')),
      employer: z.string().max(128).nullable().optional(),
      start_year: z.coerce.number().min(1900).max((new Date()).getFullYear()).nullable().optional(),
      end_year: z.coerce.number().min(1900).max((new Date()).getFullYear()).nullable().optional()
    }))
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: {
      experiences: formattedExperiences || [
        { candidate_experience_id: "", experience: '', employer: "", 
          start_year: undefined, end_year: undefined }
      ]
    },
  })

  //const { fields, append, remove } = form.control._formValues.experiences

  const { fields, append, remove } = useFieldArray({
    control: form.control, // Connect the field array to the form
    name: 'experiences', // Name of the field array
  });

  useEffect(() => {
     
    formattedExperiences = user?.candidateExperiences?.map(exp => ({
      candidate_experience_id: exp.candidate_experience_id || "",
      experience: exp.experience,
      employer: exp.employer || "",
      start_year: exp.start_year || undefined,
      end_year: exp.end_year || undefined,
    })) || [];
  
    form.setValue('experiences', formattedExperiences);
    form.trigger();
   
    page('Experience Page');

    /*if (match && match.params.fromProfile)
      //router.prefetch('/profile');
    else
      //router.prefetch('/education-complete');*/

    return () => {
        track('page_exit', { page: 'Experience Page' });
    }
  }, []);

  useEffect(() => {
    
    if (!user) {
      setLoading(true);

      profile().then(res => {
        dispatch(setUser({ user: res }));
        form.setValue('experiences', res.candidateExperiences || []);
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [user]);

  function onSubmit(values: z.infer<typeof formSchema>) {

    setLoading(true);

    saveExperience(values.experiences).then(res => {
      
      if (res.operation == 'success') {

        if (user) {
          dispatch(setUser({ user: {
            ...user,
            candidateExperiences: res.candidateExperiences
          } }));
        }

        if (query.get('fromProfile'))
          router.push('/profile');
        else
          router.push('/education-complete');
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
      <div className="mb-[100px]">
        { !query.get('fromProfile') && <OnboardProgress arrProgress={[100, 75, 0]}></OnboardProgress> }

        <h5 className="mt-[102px] mb-[40px] text-center text-[40px] font-bold leading-[56px]">
          { t("Do you have any work experience?")}
        </h5>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-[650px] m-auto mb-[100px]">
            {fields?.map((field: { id: string }, index: number) => (
              <div key={field.id} className="space-y-4">
                <FormInput
                  name={`experiences.${index}.experience`}
                  label={ t("Job Title") }
                  form={form as any}
                />

                <div className="sm:flex">
                  <div className="xs:w-full sm:w-[318px] me-[16px]">
                  <FormInput
                      name={`experiences.${index}.employer`}
                      label={ t("Employer") }
                      form={form as any}
                  />
                  </div>  

              <div className="flex xs:mt-[16px] sm:mt-0">
                  <div className="flex-col me-[16px]">
                  <FormInput
                      name={`experiences.${index}.start_year`}
                      label={ t("Start Year") }
                      form={form as any}
                      type="number"
                  />
                  </div>  

                  <div className="flex-col">
                  <FormInput
                      name={`experiences.${index}.end_year`}
                      label={ t("End Year") }
                      form={form as any}
                      type="number"
                  />
                  </div>  
                </div>
                </div>
                {fields.length > 1 && (
                  
                      <Button
                          variant={'ghost'}
                          type="button"
                          onClick={() => remove(index)}
                          className="text-red-500"
                          >
                          { t("Remove") }
                      </Button>)
                }

                {index != fields.length -1 && (
                      <div className="w-[114px] h-0.5 [background:var(--Neutral-40,#E2E2E6)] rounded-[1px] m-auto"></div>
                  ) 
                }
              </div>
            ))}
            
            <Button
              variant={'ghost'}
              type="button"
              onClick={() => append({ candidate_experience_id: "", experience: '', employer: '', start_year: undefined, end_year: undefined })}
              className="text-[color:var(--Primary-Main,#4C70F2)] text-sm font-medium leading-5"
            >
              
              <img src="/assets/icons/plus.svg" /> { t("Add experience") }
            </Button>

            { /**!form.formState.isValid || */}
            <SubmitButton disabled={ loading } loading={loading}></SubmitButton>
          </form>
        </Form>

        <OnboardFooter />
      </div>
      </AuthLayout>
    </Suspense>
  )
}
