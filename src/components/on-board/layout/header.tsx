"use client"

import { setLanguage } from "@/store/slices/appSlice";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import i18n from "@/18n";
import { useAppSelector } from "@/store/store";

export default function OnboardHeader() {

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { isAuthenticated } = useAppSelector(state => state.auth) as { isAuthenticated: boolean };

    const changeLanguage = () => {
        const language = i18n.language == "ar"? "en": "ar";
        i18n.changeLanguage(language);
        dispatch(setLanguage({
            language: language
        }));    
    }

    return (
        <div className="w-[100%] gap-2.5 [background:var(--Neutral-10,#FAFAFA)] shadow-[0px_1px_0px_0px_#F0F0F0] 
            xs:px-[24px] xs:py-[24px] sm:px-20 sm:py-6">
            <div className="max-w-5xl mx-auto">
                <Link to={ isAuthenticated? "/home": "/" }>
                    <img alt="" className="float-start" src="/assets/icons/logo.svg" />
                </Link>
 
                <button className="float-end" onClick={changeLanguage}>
                { i18n.language == "en"? "العربية": "English" } <img alt="" className={ `float-end ms-[4px] relative ${i18n.language == "en"?'': 'top-[3px]'}` } src="/assets/icons/globe.svg" />
                </button>

                <div className="clearfix"></div>
            </div>
        </div>
    );
}