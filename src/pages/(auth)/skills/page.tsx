"use client"

import { OnboardProgress } from "@/components/on-board/progress";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
import {
  Form
} from "@/components/ui/form"
import OnboardFooter from "@/components/on-board/layout/footer";
import SubmitButton from "@/components/ui/submit-button";
import { useState, useEffect, Suspense } from "react";
import { profile, updateSkills } from "@/providers/logged-in/account.service";
import { errorMessage, useQuery } from "@/utils/common";
import { useIonRouter } from "@ionic/react"; 
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setUser } from "@/store/slices/userSlice";
import { CandidateSkill } from "@/models/candidate.skill";
import { page, track } from "@/providers/analytics.service";
import { alertDialog } from "@/hooks/use-alert-dialog";
import { useTranslation } from "react-i18next";
import Loading from "./loading";


export default function SkillsPage() {

  const [loading, setLoading] = useState(false);
  const { user } = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();
  const router = useIonRouter();
  const query = useQuery();
  const [skills, setSkills] = useState<string[]>([]);
   
  const { t } = useTranslation();

  // 1. Define your form.

  const formSchema = z.object({
    skills: z.array(z.string()).min(1, {
      message: t("Please add at least one skill")
    })
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      skills: [],
    },
  })

  useEffect(() => {

    page('Skills Page');

    /*if (match && match.params.fromProfile)
      //router.prefetch('/profile');
    else
      //router.prefetch('/experience');*/

    return () => {
        track('page_exit', { page: 'Skills Page' });
    }
  }, []);

  useEffect(() => {
    if (!user) {

      setLoading(true);

      profile().then(res => {
        dispatch(setUser({ user: res }));
        const skills = res.candidate_skills.map(
          (skill: CandidateSkill) => skill.skill);
        form.setValue('skills', skills);
        setSkills(skills)
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [user]);


  function onSubmit(values: z.infer<typeof formSchema>) {
    
    setLoading(true);

    updateSkills(values).then(res => {
      if (res.operation == 'success') {

        if (user) {
          dispatch(setUser({ user: {
            ...user,
            candidateSkills: res.skills
          } }));
        }

        if (query.get('fromProfile'))
          router.push('/profile');
        else
          router.push('/experience');
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

  function removeSkill(skillToRemove: string) {
    const newSkills = skills.filter(skill => skill !== skillToRemove)
    setSkills(newSkills)
    form.setValue('skills', newSkills)
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    const input = event.currentTarget
    const value = input.value.trim()

    if ((event.key === 'Enter' || event.key === ',') && value) {
      event.preventDefault()

      //const skills = form.getValues().skills;

      addSkills(value)
      input.value = ''
    }
  }

  function addSkills(value: string) {
    if (!skills.includes(value)) {
      const newSkills = [...skills, value];
      setSkills(newSkills)
      form.setValue('skills', newSkills)
    }
  }
 

  return (
    <Suspense fallback={<Loading />}>
        { !query.get('fromProfile') && <OnboardProgress arrProgress={[100, 50, 0]}></OnboardProgress> }

        <h5 className="mt-[102px] mb-[40px] text-center text-[40px] font-bold leading-[56px]">
          {t("What’s your skills?")}
        </h5>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className=" max-w-[560px] m-auto mb-[100px]">
            
          <div className="relative">
            <div className="flex flex-wrap items-center gap-2 p-4 min-h-[70px] w-full rounded-2xl border border-input bg-white">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full 
                    bg-[var(--Primary-10,#F5F7FF)] text-[var(--Primary-100,#3538CD)]
                    text-sm font-medium"
                >
                  {skill}
                  
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="hover:text-primary-dark focus:outline-none"
                  >
                    x
                  </button>
                </span>
              ))}
              <input
                type="text"
                className="flex-1 bg-transparent border-none outline-none p-0 text-base 
                  placeholder:text-[var(--Neutral-70,#7D7D8D)]"
                placeholder={skills.length === 0 ? "Type your skills" : ""}
                onKeyDown={handleKeyDown}
              />
            </div>
            <p className="mt-2 text-sm text-[var(--Neutral-70,#7D7D8D)]">
              {t("Type \" , \" or press ↵ Enter after a skill to submit it")}
            </p>
          </div>

            <p className="mt-[16px] mb-[8px] self-stretch text-[color:var(--Neutral-100,#0F0F2C)] text-sm font-medium leading-5">
              {t("Suggestions")}:
            </p>
             
            <div className="block">
            <span 
              onClick={ () => addSkills(t('Communication')) } 
              className="cursor-pointer inline me-[8px] items-center gap-1 [background:var(--Neutral-10,#FAFAFA)] px-3 py-2 rounded-[18px]
              text-[color:var(--Neutral-80,#68687A)] text-sm font-medium leading-5">
                {t("Communication")}
            </span>

            <span 
              onClick={ () => addSkills(t('Problem Solving')) } 
              className="cursor-pointer inline me-[8px] items-center gap-1 [background:var(--Neutral-10,#FAFAFA)] px-3 py-2 rounded-[18px]
              text-[color:var(--Neutral-80,#68687A)] text-sm font-medium leading-5">
                {t("Problem Solving")}
            </span>

            <span 
              onClick={ () => addSkills(t('Time Management')) } 
              className="cursor-pointer inline me-[8px] items-center gap-1 [background:var(--Neutral-10,#FAFAFA)] px-3 py-2 rounded-[18px]
              text-[color:var(--Neutral-80,#68687A)] text-sm font-medium leading-5">
                {t('Time Management')}
            </span>
            </div> 

            <SubmitButton disabled={ skills.length == 0 || loading} loading={loading}></SubmitButton>
            
          </form>
        </Form>

        <OnboardFooter></OnboardFooter>
    </Suspense>
  );
}
