"use client"

import { page, track } from "@/providers/analytics.service";
import { Suspense, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Loading from "./loading";


export default function ContactPage() {

    const { t } = useTranslation();
    
    useEffect(() => {
        page('Contact Page');
 
        return () => {
            track('page_exit', { page: 'Contact Page' });
        }
    }, []);

    return (
        <Suspense fallback={<Loading />}>
        <div className="text-center ">

            <h5 className="mt-[82px] mb-[40px] text-[40px] font-bold leading-[56px]">
                {t("Contact us")}
            </h5>

            <h1 className="text-2xl font-bold">{t("OUR OFFICE")}</h1>
            <p className='mt-1'>
                Crystal Tower 24th floor<br />
                Sharq, Kuwait
            </p>

            <h1 className="text-2xl font-bold mt-6">{t("WORKING HOURS")}</h1>
            <p className='mt-1'>
                9AM - 5PM, Sun to Thurs
            </p>

            <h1 className="text-2xl font-bold mt-6">{t("CONTACT")}</h1>
            <p className='mt-1'>
                <a href="mailto:contact@studenthub.co">contact@studenthub.co</a> <br />
                <a href="tel:+965 22008860">+965 22008860</a> 
            </p>
 
        </div>
        </Suspense>
    );
}