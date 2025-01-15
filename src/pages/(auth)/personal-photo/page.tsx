

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
import { profile, updateProfilePhoto } from "@/providers/logged-in/account.service";
import { errorMessage, useQuery } from "@/utils/common";
import { useIonRouter } from "@ionic/react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setUser } from "@/store/slices/userSlice";
import { setAWSConfig, uploadFileToTempS3 } from "@/providers/logged-in/aws.service";
import { page, track } from "@/providers/analytics.service";
import { alertDialog } from "@/hooks/use-alert-dialog";
import { useTranslation } from "react-i18next";
import Loading from "./loading";
import AuthLayout from "../layout";


// Define the User type
interface User {
  candidate_personal_photo?: string; // Add other properties as needed
}

export default function PersonalPhotoPage() {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { user } = useAppSelector(state => state.user as { user: User });

  const dispatch = useAppDispatch();
  const router = useIonRouter();
  const query = useQuery();

  const { t } = useTranslation();

  // 1. Define your form.
  const formSchema = z.object({
    candidate_personal_photo: z.string({
        required_error: t("Please upload photo.")
    }),
    candidate_personal_photo_url: z.string(),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        candidate_personal_photo: user?.candidate_personal_photo || "",
        candidate_personal_photo_url: import.meta.env.VITE_CLOUDINARY_URL + 'candidate-photo/' + 
           user?.candidate_personal_photo || "",
    },
  })

  useEffect(() => {

    page('Personal Photo Page');

    setAWSConfig();
    
    /*if (query.get('fromProfile'))
      //router.prefetch('/profile');
    else
      //router.prefetch('/about-yourself');*/

    return () => {
        track('page_exit', { page: 'Personal Photo Page' });
    }
  }, []);

  useEffect(() => {
    if (!user) {

      setLoading(true);

      profile().then(res => {
        dispatch(setUser({ user: res }));
        
        form.setValue('candidate_personal_photo', res.candidate_personal_photo || "");
        form.setValue('candidate_personal_photo_url', import.meta.env.VITE_CLOUDINARY_URL + 'candidate-photo/' + 
           res.candidate_personal_photo || "");

      }).finally(() => {
        setLoading(false);
      });
    }
  }, [user]);
  
  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    updateProfilePhoto(values.candidate_personal_photo).then(res => {
      if (res.operation == 'success') {

        if (user) {
          
          //user.candidate_personal_photo = res.candidate_personal_photo;
          //console.log(user);

          dispatch(setUser({ user: {
            ...user,
            candidate_personal_photo: res.candidate_personal_photo
          } }));
        }

        if (query.get('fromProfile'))
          router.push('/profile');
        else
          router.push('/about-yourself');
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

  function resetPhoto() {
    form.setValue('candidate_personal_photo', "");
    form.trigger('candidate_personal_photo');
    form.setValue('candidate_personal_photo_url', "");
    form.trigger('candidate_personal_photo_url');
  }
  
  return (
    <Suspense fallback={<Loading />}>
      <AuthLayout>  
        { !query.get('fromProfile') && <OnboardProgress arrProgress={[100, 100, 24]}></OnboardProgress> }

        <h5 className="mt-[102px] mb-[8px] text-center text-[40px] font-bold leading-[56px]">
          {t("Show us what you look like")}
        </h5>
        <p className="mb-[40px] self-stretch text-[#4B4B61] text-center text-base font-normal leading-6">
          {t("Please make sure that your picture is professional, shows your face and is not blurry")}
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-[560px] m-auto mb-[100px]">
  
          { form.getValues().candidate_personal_photo && 
            <div className="w-40 h-40 m-auto border-[color:var(--Neutral-30,#EEEEF0)] 
                [background:var(--Neutral-10,#FAFAFA)] rounded-[80px] border-[1.333px] border-dashed overflow-hidden">
                
                <img onError={() => resetPhoto()} src={form.getValues().candidate_personal_photo_url} 
                  className="w-40 h-40"></img>   

            </div> }

          { !form.getValues().candidate_personal_photo && 
            <div className="w-40 h-40 m-auto border-[color:var(--Neutral-30,#EEEEF0)] 
                [background:var(--Neutral-10,#FAFAFA)] rounded-[80px] border-[1.333px] border-dashed">
                <img src="/assets/icons/camera.svg" className="w-10 h-10 m-auto mt-[48px]" />
                <a onClick={() => document.getElementById('photoUpload')?.click()} 
                className="text-[color:var(--Blue-Tint-Main,#4C70F2)] text-center 
                 text-xs font-medium leading-4 block cursor-pointer">
                   { uploading ? t("Uploading...") : t("Upload picture") }    
                </a>
            </div> }
            
            { form.getValues().candidate_personal_photo && 
                <a onClick={() => document.getElementById('photoUpload')?.click()} className="text-[color:var(--Blue-Tint-Main,#4C70F2)] text-center 
                  m-auto block text-xs font-medium leading-4 mt-[8px] cursor-pointer">
                    { uploading ? t("Uploading...") : t("Upload picture") }    
                </a> }
 
                <input
                    type="file"
                    id="photoUpload"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            setUploading(true);

                            uploadFileToTempS3(file).then((response: any) => {
                              
                              form.setValue('candidate_personal_photo', response.key);
                              form.trigger('candidate_personal_photo');
                              form.setValue('candidate_personal_photo_url', response.Location);
                              form.trigger('candidate_personal_photo_url');

                            }).catch((error) => {
                              // Handle upload error
                              console.error('Upload failed:', error);
                            }).finally(() => {
                              setUploading(false);
                            });
                        }
                    }}
                />

            <SubmitButton disabled={ !form.getValues().candidate_personal_photo || loading } float={ false } 
              loading={loading}></SubmitButton>
            
          </form>
        </Form>

        <OnboardFooter></OnboardFooter>
      </AuthLayout>
    </Suspense>
  );
}
