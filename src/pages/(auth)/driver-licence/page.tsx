

import { OnboardProgress } from "@/components/on-board/progress";
 
import SubmitButton from "@/components/ui/submit-button";
import OnboardFooter from "@/components/on-board/layout/footer";
import { Suspense } from "react";
import { useEffect, useState } from "react";
import { profile, updateDrivingLicense } from "@/providers/logged-in/account.service";
import { errorMessage, useQuery } from "@/utils/common";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { setUser } from "@/store/slices/userSlice";
import { page, track } from "@/providers/analytics.service";
import { alertDialog } from "@/hooks/use-alert-dialog";
import { useTranslation } from "react-i18next";
import Loading from "./loading";
import { useIonRouter } from "@ionic/react";
import AuthLayout from "../layout";

 
export default function DriverLicensePage() {
  
  const { t } = useTranslation();
  
  const [loading, setLoading] = useState(false);
  const { user } = useAppSelector(state => state.user);

  const [haveLicence, setHaveLicence] = useState<number | undefined>(user?.candidate_driving_license || undefined);
  const dispatch = useAppDispatch();
  const router = useIonRouter();
  
  let query = useQuery();

  useEffect(() => {

    page('Driver Licence Page');

    console.log('no haveLicence', haveLicence);
    setHaveLicence(user?.candidate_driving_license || 0);

    /*if (match && match.params.fromProfile)
      //router.prefetch('/profile');
    else
      //router.prefetch('/personal-photo');*/

    return () => {
      track('page_exit', { page: 'Driver Licence Page' });
    }
  }, []);

  useEffect(() => {
    if (!user) {
   //  form.setValue('phone', user?.candidate_phone || "");
    //} else {

      setLoading(true);

      profile().then(res => {
        dispatch(setUser({ user: res }));
        setHaveLicence(res.candidate_driving_license || 0);
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [user]);

  function onSubmit() {

    if (!haveLicence) {
      return;
    }

    setLoading(true);
    updateDrivingLicense(haveLicence).then((res: any) => {
        if (res.operation == 'success') {

          dispatch(setUser({ 
            user: {
              ...user,
              candidate_driving_license: haveLicence
            }
          }));

          if (query.get('fromProfile'))
            router.push('/profile');
          else
            router.push('/personal-photo');
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
        { !query.get('fromProfile') && <OnboardProgress arrProgress={[100, 100, 12]}></OnboardProgress> }

        <h5 className="mt-[102px] mb-[40px] text-center text-[40px] font-bold leading-[56px]">
            {t("Do you have a driver’s license?")}
        </h5>
        
        <div className="max-w-[650px] m-auto">
            <div className="flex items-center justify-center">
            
                <button onClick={ () => setHaveLicence(1) } className={ `flex-[1_0_0] flex-col xs:me-[8px] sm:me-[16px] px-6 py-5 rounded-2xl border-solid
                    
                    ${haveLicence == 1? 'border-[color:var(--Blue-Tint-Main,#4C70F2)] [background:var(--Blue-Tint-1,#F5F7FF)] border-2' :
                        'border border-[color:var(--Neutral-30,#EEEEF0)] background:var(--Neutral-0,#FFF)]' }

                    `}>
                    {t("Yes")}
                </button>
                <button onClick={ () => setHaveLicence(2) } className={ `flex-[1_0_0] flex-col xs:ms-[8px] xs:me-[8px] sm:ms-[16px] sm:me-[16px] px-6 py-5 rounded-2xl border-solid
                    
                    ${haveLicence == 2 ? 'border-[color:var(--Blue-Tint-Main,#4C70F2)] [background:var(--Blue-Tint-1,#F5F7FF)] border-2' :
                        'border border-[color:var(--Neutral-30,#EEEEF0)] background:var(--Neutral-0,#FFF)]' }
                    `}>
                    {t("No")}
                </button>
            </div>

            <SubmitButton onClick={onSubmit} disabled={!haveLicence || loading} loading={loading}></SubmitButton>
        </div>
        <OnboardFooter></OnboardFooter>
      </AuthLayout>
    </Suspense>
  );
}

