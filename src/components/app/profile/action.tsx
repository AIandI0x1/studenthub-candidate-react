import { setLanguage } from "@/store/slices/appSlice";
import { logout } from "@/store/slices/authSlice";
import { EyeClosed, Globe, KeyRound, LogOut, Trash } from "lucide-react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "@/18n";
import { removeProfile, updateJobSearchStatus } from "@/providers/logged-in/account.service";
import { useAppSelector } from "@/store/store";
import { useEffect, useState } from "react";
import { setUser } from "@/store/slices/userSlice";
import { alertDialog } from "@/hooks/use-alert-dialog";
import { userLogout$ } from "@/providers/event.service";

export function CandidateAction() {
    const router = useHistory();
    const {  t } = useTranslation();
    const dispatch = useDispatch();

    const { user } = useAppSelector((state) => state.user);

    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        //router.prefetch("/change-password");
    }, []);

    const logoutClicked = () => {   
       /* dispatch(logout());
        router.push("/");    */
        userLogout$.next({});
    }

    const changeLanguageClicked = () => {
        const language = i18n.language == "ar"? "en": "ar";
        console.log(i18n);
        i18n.changeLanguage(language, (e) => {
            console.log(e);
        });
        dispatch(setLanguage({
            language: language
        }));    
    }

    const updateJobSearchStatusClicked = () => {
        setUpdating(true);

        const params = {
            job_search_status: user?.candidate_job_search_status == 1 ? 0 : 1
        };
        
        updateJobSearchStatus(params).then((response) => {
            setUpdating(false);

            if (response.operation != 'success') {
                
                alertDialog({
                    title: t('Error'),
                    description: response.message
                });
                
            } else {
                dispatch(setUser({
                    user: {
                        ...user,
                        candidate_job_search_status: params.job_search_status
                    }
                }));
                
                router.push("/");    
            }
        });
    }

    const deleteProfileClicked = () => {
        removeProfile().then(() => {
            dispatch(logout());
            router.push("/");    
        })
    }

    return (
        <div className="w-full py-2 bg-white rounded-2xl flex-col justify-start items-start inline-flex">
             
            <div onClick={() => router.push("/change-password")} className="cursor-pointer border-slate-200 border-b  self-stretch h-12 p-3 flex-col justify-start items-start gap-2 flex">
                <div className="self-stretch justify-start items-center gap-2 inline-flex">
                    <div className="w-6 h-6 relative">
                        <KeyRound />
                    </div>
                    <div className="grow shrink basis-0 text-[#22223d] text-sm font-medium leading-tight">
                        {t("Change Password")}
                    </div>
                </div>
            </div>

            { user && !user.store && user.candidate_job_search_status && (
                <div onClick={() => !updating && updateJobSearchStatusClicked()} className="cursor-pointer border-slate-200 border-b self-stretch h-12 p-3 flex-col justify-start items-start gap-2 flex">
                    <div className="self-stretch justify-start items-center gap-2 inline-flex">
                        <div className="w-6 h-6 relative">
                            <EyeClosed />
                        </div>
                        <div className="grow shrink basis-0 text-[#22223d] text-sm font-medium leading-tight">
                        { t("I don’t want a job anymore") }  
                        </div>
                    </div>
                </div>
            )}

            <div onClick={changeLanguageClicked} className="cursor-pointer border-slate-200 border-b self-stretch h-12 p-3 flex-col justify-start items-start gap-2 flex">
                <div className="self-stretch justify-start items-center gap-2 inline-flex">
                    <div className="w-6 h-6 relative">
                        <Globe />
                    </div>
                    <div className="grow shrink basis-0 text-[#22223d] text-sm font-medium leading-tight">
                      { i18n.language == "ar"?"English": "عربي" }  
                    </div>
                </div>
            </div>
 
            <div onClick={deleteProfileClicked} className="cursor-pointer border-slate-200 border-b self-stretch h-12 p-3 flex-col justify-start items-start gap-2 flex">
                <div className="self-stretch justify-start items-center gap-2 inline-flex">
                    <div className="w-6 h-6 relative">
                        <Trash />
                    </div>
                    <div className="grow shrink basis-0 text-[#22223d] text-sm font-medium leading-tight">
                    {t("Delete Profile")}
                    </div>
                </div>
            </div>

            <div onClick={logoutClicked} className="cursor-pointer  self-stretch h-12 p-3 flex-col justify-start items-start gap-2 flex">
                <div className="self-stretch justify-start items-center gap-2 inline-flex">
                    <div className="w-6 h-6 relative">
                        <LogOut />
                    </div>
                    <div className="grow shrink basis-0 text-[#22223d] text-sm font-medium leading-tight">
                        {t("Logout")}
                    </div>
                </div>
            </div>
        </div>
    );
}

