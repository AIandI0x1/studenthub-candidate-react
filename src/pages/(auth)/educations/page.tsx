"use client"

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
import { saveEducation } from "@/providers/logged-in/candidate-education.service";
import PagedUniversityInput from "@/components/on-board/paged-university-input";
import PagedMajorInput from "@/components/on-board/paged-major";
import PagedDegreeInput from "@/components/on-board/paged-degree-input";
import { page, track } from "@/providers/analytics.service";
import { alertDialog } from "@/hooks/use-alert-dialog";
import { useTranslation } from "react-i18next";
import Loading from "./loading";
import { useIonRouter } from "@ionic/react";


export default function EducationsPage() {

  const [loading, setLoading] = useState(false);
  const { user } = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();
  const router = useIonRouter();
  //const params = useParams();
  const query = useQuery();

  let formattedEducations: any[] = [];

  const { t } = useTranslation();

  const formSchema = z.object({
    candidateEducations: z.array(z.object({
      university: z.any(),
      degree: z.any(),
      major: z.any(),

      education_uuid: z.string().nullable(),
      graduation_year: z.coerce.number().min(1900)
        .max((new Date()).getFullYear()).nullable().optional(), //.min(1, 'End year is required'),
      university_id: z.coerce.number().min(1, t("University is required")),
      degree_uuid: z.string(),
      major_uuid: z.string(),
      is_currently_studying: z.boolean(),
    }))
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      candidateEducations: user?.candidateEducations || []
    },
  })

  useEffect(() => {

    page('Education Page');

    /*if (match && match.params.fromProfile)
      //router.prefetch('/profile');
    else
      //router.prefetch('/skills');*/

    return () => {
      track('page_exit', { page: 'Education Page' });
    }
  }, []);

  useEffect(() => {
    if (!user) {
      setLoading(true);

      profile().then(res => {
        dispatch(setUser({ user: res }));
        form.setValue('candidateEducations', res.candidateEducations || []);
        form.trigger();
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [user]);

  //const { fields, append, remove } = form.control._formValues.candidateEducations

  const { fields, append, remove } = useFieldArray({
    control: form.control, // Connect the field array to the form
    name: 'candidateEducations', // Name of the field array
  });

  useEffect(() => {
    
    formattedEducations = user?.candidateEducations?.map(edu => ({
      education_uuid: edu.education_uuid || null,
      university_id: edu.university?.university_id,
      degree_uuid: edu.degree?.degree_uuid,
      major_uuid: edu.major?.major_uuid,
      graduation_year: edu.graduation_year,
      is_currently_studying: edu.is_currently_studying,

      university: edu.university,
      degree: edu.degree,
      major: edu.major,
    })) || [];

   form.setValue('candidateEducations', formattedEducations || []);
   form.trigger();
  }, []);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)

    setLoading(true);

    saveEducation(values.candidateEducations).then(res => {
      if (res.operation == 'success') {

        if (user) {
          dispatch(setUser({ user: {
            ...user,
            candidateEducations: res.candidateEducations
          } }));
        }

        if (query.get('fromProfile'))
          router.push('/profile');
        else
          router.push('/skills');
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
    <div className="mb-[100px]">
      { !query.get('fromProfile') && <OnboardProgress arrProgress={[100, 25, 0]}></OnboardProgress> }

      <h5 className="mt-[102px] mb-[40px] text-center text-[40px] font-bold leading-[56px]">
        {t("Where did you study?")}
      </h5>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-[560px] m-auto mb-[100px]">
          {fields?.map((field: { id: string }, index: number) => (
            <div key={field.id} className="space-y-4">

              <PagedUniversityInput
                selectedUniversity={form.getValues(`candidateEducations.${index}.university`)}
                onSelect={(university: any) => {
                  if (university) {
                    form.setValue(`candidateEducations.${index}.university`, 
                      university.university_name_en);
                    form.setValue(`candidateEducations.${index}.university_id`, university.university_id);
                  } else {
                    form.setValue(`candidateEducations.${index}.university`, "");
                    form.setValue(`candidateEducations.${index}.university_id`, 0);
                  }
                  form.trigger();
                }}
                name={`candidateEducations.${index}.university`}
                form={form as any}
              />

              <PagedDegreeInput 
                selectedDegree={form.getValues(`candidateEducations.${index}.degree`)}
                onSelect={(degree: any) => {
                  if (degree) {
                    form.setValue(`candidateEducations.${index}.degree`, degree.degree_name_en);
                    form.setValue(`candidateEducations.${index}.degree_uuid`, degree.degree_uuid);
                  } else {
                    form.setValue(`candidateEducations.${index}.degree`, "");
                    form.setValue(`candidateEducations.${index}.degree_uuid`, "");
                  }
                }}
                name={`candidateEducations.${index}.degree`}
                form={form as any}
              />  
 
              <div className="flex">
                <div className="flex-1 me-[16px]">
                  <PagedMajorInput
                    selectedMajor={form.getValues(`candidateEducations.${index}.major`)}
                    onSelect={(major: any) => {
                      if (major) {
                        form.setValue(`candidateEducations.${index}.major`, 
                          major.major_name_en);
                        form.setValue(`candidateEducations.${index}.major_uuid`, major.university_id);
                      } else {
                        form.setValue(`candidateEducations.${index}.major`, "");
                        form.setValue(`candidateEducations.${index}.major_uuid`, "");
                      }
                      form.trigger();
                    }}
                    name={`candidateEducations.${index}.major`}
                    form={form as any}
                  />
                </div>  
                <div className="flex-1">
                  <FormInput
                      name={`candidateEducations.${index}.graduation_year`}
                      label="Year of Graduation"
                      form={form as any}
                      type="number"
                  />
                </div>  
              </div>

              {fields.length > 1 && (
                
                    <Button
                        variant={'ghost'}
                        type="button"
                        onClick={() => remove(index)}
                        className="text-red-500"
                        >
                        {t("Remove")}
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
            onClick={() => {
  
              append({ 
                university: '', degree: '', major: '', 
                graduation_year: undefined, education_uuid: "", 
                university_id: 0, degree_uuid: '', major_uuid: '', 
                is_currently_studying: false 
              });
            }}
            className="text-[color:var(--Primary-Main,#4C70F2)] text-sm font-medium leading-5"
          >
            
            <img src="/assets/icons/plus.svg" /> {t("Add education")}
          </Button>

          <SubmitButton disabled={!form.formState.isValid || loading } loading={loading}></SubmitButton>
        </form>
      </Form>

      <OnboardFooter />
    </div>
    </Suspense>
  )
}
