"use client"

import OnboardFooter from "@/components/on-board/layout/footer";
import { Button } from "@/components/ui/button";
import { page, track } from "@/providers/analytics.service";
import { useIonRouter } from "@ionic/react";
import { Suspense, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Loading from "./loading";
import { Link } from "react-router-dom";
import AuthLayout from "../layout";

export default function EducationCompletedPage() {

    const { t} = useTranslation();
    const router = useIonRouter();

    useEffect(() => {

        page('Education Complete Page');
        
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Enter') {
                router.push("/driver-license");
            }
        };
    
        document.addEventListener('keydown', handleKeyDown);
        
        //router.prefetch('/driver-license');
        
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
         
            track('page_exit', { page: 'Education Complete Page' });
        }
    }, []);

    return (
        <Suspense fallback={<Loading />}>
            <AuthLayout>  
            <div className="flex  min-h-screen flex-col items-center  text-center px-4 p-[16px]">

                <div className="w-[240px] h-[240px] bg-[#f9f9f9] rounded-[118px] flex justify-center items-center mb-[40px] xs:mt-[87px] sm:mt-[40px]">
                    <img alt="" src="/assets/icons/graduated.svg" className="w-[128px] h-[128px]" />
                </div>

                <h5 className="self-stretch text-[color:var(--Neutral-100,#0F0F2C)] text-center font-bold xs:text-xl xs:leading-7 sm:text-[40px] sm:leading-[56px]">
                    {t("Looks good! One more step to go")}
                </h5>

                <div className="xs:flex sm:block xs:bottom-[60px] xs:fixed sm:bottom-auto sm:mt-8 sm:relative font-semibold text-base">
                    <Link to="/driver-license">
                    <Button size="lg" className=" sm:w-[300px] h-[56px]">
                        {t("Continue")}
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