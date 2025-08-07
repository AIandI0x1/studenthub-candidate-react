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
import { errorMessage, langContent, useQuery } from "@/utils/common";
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
import AuthLayout from "../layout";
import { CandidateEducation } from "@/models/candidate-education";


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
      university: z.string().optional(),
      degree: z.string().optional(),
      major: z.string().optional(),
      education_uuid: z.string().nullable().optional(),
      
      // New fields
      education_type: z.enum(['standard', 'custom_university', 'studying_abroad', 'not_studying'], {
        required_error: t('Please select an option')
      }),
      
      custom_institution_name: z.string().nullable().optional(),
      
      // Conditional validation based on education_type
      university_id: z.number().nullable().optional()
        .superRefine((val, ctx) => {
          const index = Number(ctx.path[1]);
          const data = form.getValues(`candidateEducations`)[Number(ctx.path[1])];
          if (data?.education_type === 'standard' && !data?.university_id) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t('University is required')
            });
          }
        }),

      degree_uuid: z.string().nullable().optional()
        .superRefine((val, ctx) => {
          const data = form.getValues(`candidateEducations`)[Number(ctx.path[1])];
          if (data?.education_type !== 'not_studying' && !data?.degree_uuid) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: t('Degree is required')
            });
          }
        }),
      
      major_uuid: z.string().nullable().optional(),
      custom_major: z.string().nullable().optional()
        .superRefine((val, ctx) => {
        const data = form.getValues(`candidateEducations`)[Number(ctx.path[1])];
        if (data?.education_type === 'not_studying') return true;
        
        if (data.major_uuid == null && !data.custom_major) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('Please specify your field of study')
          });
        }
      }),
      
      graduation_year: z.preprocess((val) => (val ? parseInt(val) : null), z.number().nullable().optional()
      .superRefine((val, ctx) => {
        const data = form.getValues(`candidateEducations`)[Number(ctx.path[1])];
        
        if (data?.education_type !== 'not_studying' && !data?.graduation_year) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t('Graduation year is required')
          });
        }
      })),
      
      is_currently_studying: z.boolean().default(false).optional()
    }))
  })
//
        //.max((new Date()).getFullYear()), //.min(1, 'End year is required'),
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    //reValidateMode: "all",
    defaultValues: {
      candidateEducations: generateFormValue(user?.candidateEducations || [])
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
        form.setValue('candidateEducations', generateFormValue(res.candidateEducations || []));
        form.trigger();
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [user]);

  //const { fields, append, remove } = form.control._formValues.candidateEducations

  /*useEffect(() => {
    // Trigger validation whenever fields change
    const subscription = form.watch(() => {
      form.trigger('candidateEducations');
    });

    return () => subscription.unsubscribe();
  }, [form]);*/

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'candidateEducations',
  });

  /*useEffect(() => {
    if (user?.candidateEducations) {
      form.setValue('candidateEducations', generateFormValue(user.candidateEducations));
      form.trigger();
    }
  }, []);*/

  function generateFormValue(candidateEducations: CandidateEducation[]) {
    return candidateEducations?.map(edu => ({
      university: langContent(edu.university?.university_name_en, edu.university?.university_name_ar),
      degree: langContent(edu.degree?.degree_name_en, edu.degree?.degree_name_ar),
      major: langContent(edu.major?.major_name_en, edu.major?.major_name_ar),
    
      education_uuid: edu.education_uuid || "",
      graduation_year: edu.graduation_year ? parseInt(edu.graduation_year + '') : null,
    
      university_id: edu.university?.university_id || 0,
      degree_uuid: edu.degree?.degree_uuid || '',
      major_uuid: edu.major?.major_uuid || '',
      is_currently_studying: !!edu.is_currently_studying || !edu.graduation_year || false,
      
      // New fields
      education_type: edu.education_type || 'standard',
      custom_institution_name: edu.custom_institution_name || '',
      custom_major: edu.custom_major || ''
    }));
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    
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
      <AuthLayout>  
      <div className="mb-[100px]">
        { !query.get('fromProfile') && <OnboardProgress arrProgress={[100, 25, 0]}></OnboardProgress> }

        <h5 className="mt-[102px] mb-[40px] text-center text-[40px] font-bold leading-[56px]">
          {t("Where did you study?")}
        </h5>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-[560px] m-auto mb-[100px]">
            {fields?.map((field: { id: string }, index: number) => (
              <div key={field.id} className="space-y-4">

                <div className="mb-4">
                  <PagedUniversityInput
                    required={true}
                    educationDetail={form.getValues(`candidateEducations.${index}`) as CandidateEducation}
                    onSelect={(university: any) => {
                      if (university?.is_special) {
                        // Handle special options (custom university, studying abroad, not studying)
                        form.setValue(`candidateEducations.${index}.education_type`, university.type);
                        form.setValue(`candidateEducations.${index}.university`, university.label);
                        form.setValue(`candidateEducations.${index}.university_id`, null);
                      } else if (university) {
                        // Handle regular university selection
                        form.setValue(`candidateEducations.${index}.education_type`, 'standard');
                        form.setValue(`candidateEducations.${index}.university`, 
                          langContent(university.university_name_en, university.university_name_ar));
                        form.setValue(`candidateEducations.${index}.university_id`, university.university_id);
                        form.setValue(`candidateEducations.${index}.custom_institution_name`, null);
                      } else {
                        form.setValue(`candidateEducations.${index}.university`, "");
                        form.setValue(`candidateEducations.${index}.university_id`, null);
                        form.setValue(`candidateEducations.${index}.education_type`, 'standard');
                      }
                      form.trigger();
                    }}
                    name={`candidateEducations.${index}.university`}
                    custom_institution_name={`candidateEducations.${index}.custom_institution_name`}
                    form={form as any}
                  />
                  
                  {/* Hidden field for education_type */}
                  <input
                    type="hidden"
                    {...form.register(`candidateEducations.${index}.education_type`)}
                    defaultValue={form.getValues(`candidateEducations.${index}.education_type`) || 'standard'}
                  />
                  
                  {/* Hidden field for custom_institution_name */}
                  <input
                    type="hidden"
                    {...form.register(`candidateEducations.${index}.custom_institution_name`)}
                  />
                </div>

                {form.watch(`candidateEducations.${index}.education_type`) !== 'not_studying' && (
                  <>
                    <PagedDegreeInput 
                      selectedDegree={form.getValues(`candidateEducations.${index}.degree`)}
                      onSelect={(degree: any) => {
                        if (degree) {
                          form.setValue(`candidateEducations.${index}.degree`, 
                            langContent(degree.degree_name_en, degree.degree_name_ar));
                          form.setValue(`candidateEducations.${index}.degree_uuid`, degree.degree_uuid);
                        } else {
                          form.setValue(`candidateEducations.${index}.degree`, "");
                          form.setValue(`candidateEducations.${index}.degree_uuid`, "");
                        }
                      }}
                      name={`candidateEducations.${index}.degree`}
                      form={form as any}
                      required={true}
                    />
      
                    <div className="flex">
                      <div className="flex-1 me-[16px]">
                        <PagedMajorInput
                          required={true}
                          selectedMajor={form.getValues(`candidateEducations.${index}.major`)}
                          onSelect={(major: any) => {
                            if (major.other) {
                              form.setValue(`candidateEducations.${index}.major`, "Other");
                              form.setValue(`candidateEducations.${index}.major_uuid`, "");
                              
                            } else if (major) {
                              form.setValue(`candidateEducations.${index}.major`, 
                                langContent(major.major_name_en, major.major_name_ar));
                              form.setValue(`candidateEducations.${index}.major_uuid`, major.major_uuid);
                            } else {
                              form.setValue(`candidateEducations.${index}.major`, "");
                              form.setValue(`candidateEducations.${index}.major_uuid`, "");
                            }
                            form.trigger();
                          }}
                          name={`candidateEducations.${index}.major`}
                          custom_major={`candidateEducations.${index}.custom_major`}  
                          form={form as any}
                        />
                      </div>  
                      <div className="flex-1">
                        <FormInput
                          name={`candidateEducations.${index}.graduation_year`}
                          label="Year of Graduation"
                          form={form as any}
                          type="number"
                          required={!form.watch(`candidateEducations.${index}.is_currently_studying`)}
                        />
                      </div>  
                    </div>
                  </>
                )}

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
                  university: '', 
                  degree: '', 
                  major: '', 
                  graduation_year: null, 
                  education_uuid: "", 
                  university_id: null, 
                  degree_uuid: '', 
                  major_uuid: '', 
                  is_currently_studying: false,
                  education_type: 'standard',
                  custom_institution_name: null
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
      </AuthLayout>
    </Suspense>
  )
}
