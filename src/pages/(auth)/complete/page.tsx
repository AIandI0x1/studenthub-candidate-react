

import OnboardFooter from "@/components/on-board/layout/footer";
import { Button } from "@/components/ui/button";
import { page, track } from "@/providers/analytics.service";

import { Suspense, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Loading from "./loading";
import { Link } from "react-router-dom";
import { useIonRouter } from "@ionic/react";
import AuthLayout from "../layout";
 

export default function CompletePage() {

    const {t} = useTranslation();
    const router = useIonRouter();
    
    useEffect(() => {

        page('Complete Profile Page');

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                router.push("/");
            }
        };
    
        document.addEventListener('keydown', handleKeyDown);
        
        return () => {
            document.removeEventListener('keydown', handleKeyDown);

            track('page_exit', { page: 'Complete Profile Page' });
        }
    }, []);

    return (
        <Suspense fallback={<Loading />}>
          <AuthLayout>  
            <div className="flex  min-h-screen flex-col items-center  text-center px-4 p-[16px]">

                <div className="w-[240px] h-[240px] bg-[#f9f9f9] rounded-[118px] flex justify-center items-center mb-[40px] xs:mt-[87px] sm:mt-[40px]">
                    <img alt="" src="/assets/icons/task.svg" className="w-[128px] h-[128px]" />
                </div>

                <h5 className="self-stretch text-[color:var(--Neutral-100,#0F0F2C)] text-center font-bold xs:text-xl xs:leading-7 sm:text-[40px] sm:leading-[56px]">
                    {t("Congratulations! your account is now ready. Let’s get you working!")}
                </h5>


                <div className="xs:flex sm:block xs:bottom-[60px] xs:fixed sm:bottom-auto sm:mt-8 sm:relative font-semibold text-base">
                    <Link to="/">
                        <Button size="lg" className=" sm:w-[300px] h-[56px]">
                            {t("Let’s go!")}
                        </Button>
                    </Link>

                    <p className="mt-[8px] xs:hidden sm:block">{t("Enter ↵")}</p> 
                </div>

                <OnboardFooter></OnboardFooter>      
            </div>
          </AuthLayout>
        </Suspense>
    );
}