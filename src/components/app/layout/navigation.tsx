import { Badge } from "@/components/ui/badge";
import { setPath } from "@/store/slices/appSlice";
import { StoreState, useAppDispatch, useAppSelector } from "@/store/store";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function Navigation() {
 
// typeof window !== undefined? window.location.pathname : 

    const { path } = useAppSelector((state: StoreState) => state.app);
    const { user } = useAppSelector((state: StoreState) => state.user);

    const dispatch = useAppDispatch();

    const { t } = useTranslation();
    const router = useHistory();

    const open = (path: string) => {
        router.push(path)
        dispatch(setPath({
            path: path
        }));
    }
    
    const { pendingInvitations, totalUnreadActivity } = useAppSelector((state: StoreState) => state.app);
    
    useEffect(() => {
        dispatch(setPath({
            path: location.pathname
        }));
    }, []);

    return (
        <div className="xs:fixed sm:relative bottom-0  w-full xs:h-[78px] sm:h-[57px] pt-2 pb-4 bg-white shadow block xs:z-10">

            <div className="max-w-4xl mx-auto py-1">

                <div className="w-full justify-start items-start  inline-flex">
                    <div onClick={() => open("/home")} className="cursor-pointer grow shrink basis-0 xs:flex-col sm:flex-row justify-center items-center gap-0.5 inline-flex">

                        <svg className={`rounded-[10px] ${path == "/home" ? 'bg-[#f4f6ff]' : ''}`} width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M22.5 28H23.5C24.6046 28 25.5 27.1046 25.5 26V18C25.5 17.7239 25.7239 17.5 26 17.5H27.7521C28.2031 17.5 28.4236 16.9498 28.0973 16.6383L19.3809 8.31818C18.6081 7.58046 17.3919 7.58046 16.619 8.31818L7.90271 16.6383C7.57642 16.9498 7.79687 17.5 8.24795 17.5H10C10.2761 17.5 10.5 17.7239 10.5 18V26C10.5 27.1046 11.3954 28 12.5 28H13.5V22.9999C13.5 21.3431 14.8431 19.9999 16.5 19.9999H19.5C21.1568 19.9999 22.5 21.3431 22.5 22.9999V28Z" fill={`${path == "/home" ? '#4C70F2' : '#7d7d8d'}`} />
                            <path d="M22.5 28H21.5V29H22.5V28ZM28.0973 16.6383L28.7878 15.915L28.7878 15.915L28.0973 16.6383ZM19.3809 8.31818L18.6905 9.04154L18.6905 9.04154L19.3809 8.31818ZM16.619 8.31818L15.9286 7.59483V7.59483L16.619 8.31818ZM7.90271 16.6383L8.59318 17.3617H8.59318L7.90271 16.6383ZM13.5 28V29H14.5V28H13.5ZM23.5 27H22.5V29H23.5V27ZM24.5 26C24.5 26.5523 24.0523 27 23.5 27V29C25.1569 29 26.5 27.6569 26.5 26H24.5ZM24.5 18V26H26.5V18H24.5ZM26 16.5C25.1716 16.5 24.5 17.1716 24.5 18H26.5C26.5 18.2761 26.2761 18.5 26 18.5V16.5ZM27.7521 16.5H26V18.5H27.7521V16.5ZM27.4068 17.3617C27.0805 17.0502 27.301 16.5 27.7521 16.5V18.5C29.1053 18.5 29.7666 16.8493 28.7878 15.915L27.4068 17.3617ZM18.6905 9.04154L27.4068 17.3617L28.7878 15.915L20.0714 7.59483L18.6905 9.04154ZM17.3095 9.04154C17.6959 8.67268 18.3041 8.67268 18.6905 9.04154L20.0714 7.59483C18.9122 6.48825 17.0878 6.48825 15.9286 7.59483L17.3095 9.04154ZM8.59318 17.3617L17.3095 9.04154L15.9286 7.59483L7.21223 15.915L8.59318 17.3617ZM8.24795 16.5C8.69902 16.5 8.91948 17.0502 8.59318 17.3617L7.21223 15.915C6.23336 16.8493 6.89471 18.5 8.24795 18.5V16.5ZM10 16.5H8.24795V18.5H10V16.5ZM11.5 18C11.5 17.1716 10.8284 16.5 10 16.5V18.5C9.72386 18.5 9.5 18.2761 9.5 18H11.5ZM11.5 26V18H9.5V26H11.5ZM12.5 27C11.9477 27 11.5 26.5523 11.5 26H9.5C9.5 27.6569 10.8431 29 12.5 29V27ZM13.5 27H12.5V29H13.5V27ZM14.5 28V22.9999H12.5V28H14.5ZM14.5 22.9999C14.5 21.8954 15.3954 20.9999 16.5 20.9999V18.9999C14.2909 18.9999 12.5 20.7908 12.5 22.9999H14.5ZM16.5 20.9999H19.5V18.9999H16.5V20.9999ZM19.5 20.9999C20.6046 20.9999 21.5 21.8954 21.5 22.9999H23.5C23.5 20.7908 21.7091 18.9999 19.5 18.9999V20.9999ZM21.5 22.9999V28H23.5V22.9999H21.5Z"
                                fill={`${path == "/home" ? '#4C70F2' : '#7d7d8d'}`} />
                        </svg>
                        <div className={`sm:mt-3 sm:ms-2 self-stretch text-center ${path == "/home" ? 'text-[#4c6ff2]' : 'text-[#7d7d8d]'} text-xs font-bold leading-none`}>
                            {t('Home')}
                        </div>
                    </div>

                    <div onClick={() => open("/invitation")} className="relative cursor-pointer grow shrink basis-0 xs:flex-col sm:flex-row justify-center items-center gap-0.5 inline-flex">
                        <svg className={`rounded-[10px] ${path == "/invitation" ? 'bg-[#f4f6ff]' : ''}`} width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="8" y="11" width="20" height="14" rx="2" stroke={path == "/invitation" ? '#4C70F2' : '#7d7d8d'} strokeWidth="2" />
                            <path d="M10.3246 11H25.6754C26.6178 11 27.037 12.1843 26.3046 12.7772L18.6292 18.9906C18.2623 19.2877 17.7377 19.2877 17.3708 18.9906L9.69542 12.7772C8.96296 12.1843 9.38223 11 10.3246 11Z"
                                stroke={path == "/invitation" ? '#4C70F2' : '#7d7d8d'} strokeWidth="2" />
                        </svg>

                        <div className={`relative sm:mt-3 sm:ms-2 self-stretch text-center ${path == "/invitation" ? 'text-[#4c6ff2]' : 'text-[#7d7d8d]'} text-xs font-semibold leading-none`}>
                            {t('Invitations')}
                        </div>

                        {pendingInvitations > 0 && <Badge variant={"destructive"} className="rounded-full xs:absolute sm:relative top-0 end-0" color="warning">
                                {pendingInvitations}
                                </Badge>}
                    </div>

                    { user?.store_id && 
                    <div onClick={() => open("/work-log/track-work")} className="cursor-pointer grow shrink basis-0 xs:flex-col sm:flex-row justify-center items-center gap-0.5 inline-flex">

                        <svg className={`rounded-[10px] ${path == "/work-log/track-work" ? 'bg-[#f4f6ff]' : ''}`} width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M26.75 19.25C26.75 24.08 22.83 28 18 28C13.17 28 9.25 24.08 9.25 19.25C9.25 14.42 13.17 10.5 18 10.5C22.83 10.5 26.75 14.42 26.75 19.25Z"
                                stroke={path == "/work-log/track-work" ? '#4C70F2' : '#7d7d8d'} strokeWidth="2" strokeLinecap="round" />
                            <path d="M18 14V19" stroke={path == "/work-log/track-work" ? '#4C70F2' : '#7d7d8d'} strokeWidth="2" strokeLinecap="round" />
                            <path d="M15 8H21" stroke={path == "/work-log/track-work" ? '#4C70F2' : '#7d7d8d'} strokeWidth="2" strokeLinecap="round" />
                        </svg>

                        <div className={`sm:mt-3 sm:ms-2 self-stretch text-center ${path == "/work-log/track-work" ? 'text-[#4c6ff2]' : 'text-[#7d7d8d]'}  text-xs font-semibold leading-none`}>
                            {t('Track')}
                        </div>
                    </div> }

                    <div onClick={() => open("/payments")} className="cursor-pointer grow shrink basis-0 xs:flex-col sm:flex-row justify-center items-center gap-0.5 inline-flex">
                        <svg className={`rounded-[10px] ${path == "/payments" ? 'bg-[#f4f6ff]' : ''}`} width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="8" y="8" width="20" height="20" rx="10" stroke={path == "/payments" ? '#4C70F2' : '#7d7d8d'} strokeWidth="2" />
                            <path d="M17.3916 12.6032V13.297C16.0293 13.5505 15 14.6302 15 15.9215C15 16.8083 15.4964 17.9908 17.8518 18.5882C19.1352 18.9139 19.7893 19.4146 19.7893 20.0784C19.7893 20.893 18.9901 21.5565 18.003 21.5565C17.016 21.5565 16.2168 20.893 16.2168 20.0784C16.2168 19.7466 15.9444 19.4752 15.6115 19.4752C15.2785 19.4752 15.0061 19.7466 15.0061 20.0784C15.0061 21.3695 16.0354 22.4554 17.3977 22.7029V23.3968C17.3977 23.7286 17.6701 24 18.003 24C18.336 24 18.6084 23.7286 18.6084 23.3968V22.7029C19.9707 22.4494 21 21.3697 21 20.0784C21 19.1916 20.5036 18.0092 18.1482 17.4179C16.8648 17.0921 16.2107 16.5914 16.2107 15.9216C16.2107 15.107 17.0099 14.4435 17.997 14.4435C18.984 14.4435 19.7832 15.107 19.7832 15.9216C19.7832 16.2534 20.0556 16.5248 20.3885 16.5248C20.7215 16.5248 20.9939 16.2534 20.9939 15.9216C20.9939 14.6305 19.9646 13.5446 18.6023 13.2971V12.6032C18.6023 12.2714 18.3299 12 17.997 12C17.664 11.9997 17.3916 12.2654 17.3916 12.6032V12.6032Z"
                                fill={path == "/payments" ? '#4C70F2' : '#7d7d8d'} stroke={path == "/payments" ? '#4C70F2' : '#7d7d8d'}
                                strokeWidth="0.5" />
                        </svg>

                        <div className={`sm:mt-3 sm:ms-2 self-stretch text-center ${path == "/payments" ? 'text-[#4c6ff2]' : 'text-[#7d7d8d]'} text-xs font-semibold leading-none`}>
                            {t('Payments')}
                        </div>
                    </div>

                    <div onClick={() => open("/jobs")} className="cursor-pointer grow shrink basis-0 xs:flex-col sm:flex-row justify-center items-center gap-0.5 inline-flex">
                                
                        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                        { path == "/jobs" && <rect width="36" height="36" rx="10" fill="#F5F7FF"/> }
                        <rect x="8.5" y="13.1667" width="19" height="14.3333" rx="3" stroke={path == "/jobs" ? '#4C70F2' : '#7d7d8d'} strokeWidth="2"/>
                        <path d="M13.3333 13.3334C13.3333 10.7561 15.4227 8.66675 18 8.66675C20.5773 8.66675 22.6667 10.7561 22.6667 13.3334" 
                            stroke={path == "/jobs" ? '#4C70F2' : '#7d7d8d'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
        
                        <div className={`sm:mt-3 sm:ms-2 self-stretch text-center ${path == "/jobs" ? 'text-[#4c6ff2]' : 'text-[#7d7d8d]'} text-xs font-semibold leading-none`}>
                            {t('Jobs')}
                        </div>
                    </div>

                    {/*<div onClick={() => open("/discounts")} className="cursor-pointer grow shrink basis-0 xs:flex-col sm:flex-row justify-center items-center gap-0.5 inline-flex">
                        <svg className={`rounded-[10px] ${path == "/discounts" ? 'bg-[#f4f6ff]' : ''}`} width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="8" y="8" width="20" height="20" rx="10" stroke={path == "/discounts" ? '#4C70F2' : '#7d7d8d'} strokeWidth="2" />
                            <path d="M17.3916 12.6032V13.297C16.0293 13.5505 15 14.6302 15 15.9215C15 16.8083 15.4964 17.9908 17.8518 18.5882C19.1352 18.9139 19.7893 19.4146 19.7893 20.0784C19.7893 20.893 18.9901 21.5565 18.003 21.5565C17.016 21.5565 16.2168 20.893 16.2168 20.0784C16.2168 19.7466 15.9444 19.4752 15.6115 19.4752C15.2785 19.4752 15.0061 19.7466 15.0061 20.0784C15.0061 21.3695 16.0354 22.4554 17.3977 22.7029V23.3968C17.3977 23.7286 17.6701 24 18.003 24C18.336 24 18.6084 23.7286 18.6084 23.3968V22.7029C19.9707 22.4494 21 21.3697 21 20.0784C21 19.1916 20.5036 18.0092 18.1482 17.4179C16.8648 17.0921 16.2107 16.5914 16.2107 15.9216C16.2107 15.107 17.0099 14.4435 17.997 14.4435C18.984 14.4435 19.7832 15.107 19.7832 15.9216C19.7832 16.2534 20.0556 16.5248 20.3885 16.5248C20.7215 16.5248 20.9939 16.2534 20.9939 15.9216C20.9939 14.6305 19.9646 13.5446 18.6023 13.2971V12.6032C18.6023 12.2714 18.3299 12 17.997 12C17.664 11.9997 17.3916 12.2654 17.3916 12.6032V12.6032Z"
                                fill={path == "/discounts" ? '#4C70F2' : '#7d7d8d'} stroke={path == "/discounts" ? '#4C70F2' : '#7d7d8d'}
                                strokeWidth="0.5" />
                        </svg>

                        <div className={`sm:mt-3 sm:ms-2 self-stretch text-center ${path == "/discounts" ? 'text-[#4c6ff2]' : 'text-[#7d7d8d]'} text-xs font-semibold leading-none`}>
                            {t('Discounts')}
                        </div>
                    </div>*/}
                    
                    {/* 
                    <div onClick={() => open("/activity")} className="sm:hidden relative cursor-pointer grow shrink basis-0 xs:flex-col sm:flex-row justify-center items-center gap-0.5 inline-flex">
                        {/* 
                        <svg className={`rounded-[10px] ${path == "/activity" ? 'bg-[#f4f6ff]' : ''}`} width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="8" y="8" width="20" height="20" rx="10" stroke={path == "/activity" ? '#4C70F2' : '#7d7d8d'} strokeWidth="2" />
                            <path d="M17.3916 12.6032V13.297C16.0293 13.5505 15 14.6302 15 15.9215C15 16.8083 15.4964 17.9908 17.8518 18.5882C19.1352 18.9139 19.7893 19.4146 19.7893 20.0784C19.7893 20.893 18.9901 21.5565 18.003 21.5565C17.016 21.5565 16.2168 20.893 16.2168 20.0784C16.2168 19.7466 15.9444 19.4752 15.6115 19.4752C15.2785 19.4752 15.0061 19.7466 15.0061 20.0784C15.0061 21.3695 16.0354 22.4554 17.3977 22.7029V23.3968C17.3977 23.7286 17.6701 24 18.003 24C18.336 24 18.6084 23.7286 18.6084 23.3968V22.7029C19.9707 22.4494 21 21.3697 21 20.0784C21 19.1916 20.5036 18.0092 18.1482 17.4179C16.8648 17.0921 16.2107 16.5914 16.2107 15.9216C16.2107 15.107 17.0099 14.4435 17.997 14.4435C18.984 14.4435 19.7832 15.107 19.7832 15.9216C19.7832 16.2534 20.0556 16.5248 20.3885 16.5248C20.7215 16.5248 20.9939 16.2534 20.9939 15.9216C20.9939 14.6305 19.9646 13.5446 18.6023 13.2971V12.6032C18.6023 12.2714 18.3299 12 17.997 12C17.664 11.9997 17.3916 12.2654 17.3916 12.6032V12.6032Z"
                                fill={path == "/activity" ? '#4C70F2' : '#7d7d8d'} stroke={path == "/discounts" ? '#4C70F2' : '#7d7d8d'}
                                strokeWidth="0.5" />
                        </svg>

                        <span className={`rounded-[10px] ${path == "/activity" ? 'bg-[#f4f6ff]' : ''} w-9 h-9 p-2`}>
                            <Bell className={ `size-5 ${path == "/activity" ? 'fill-[#4C70F2]' : 'fill-[#7d7d8d]'}` } />
                        </span>    
                        
                        <div className={`sm:mt-3 sm:ms-2 self-stretch text-center ${path == "/activity" ? 'text-[#4c6ff2]' : 'text-[#7d7d8d]'} text-xs font-semibold leading-none`}>
                            {t('Alerts')}
                        </div>

                        {totalUnreadActivity > 0 && <Badge variant={"destructive"} className="rounded-full xs:absolute sm:relative top-0 end-0" color="warning">
                                {totalUnreadActivity}
                                </Badge>}
                    </div>*/}

                    <div onClick={() => open("/profile")} className="cursor-pointer grow shrink basis-0 xs:flex-col sm:flex-row justify-center items-center gap-0.5 inline-flex">
                        <svg className={`rounded-[10px] ${path == "/profile" ? 'bg-[#f4f6ff]' : ''}`} width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="18" cy="12" r="4" stroke={path == "/profile" ? '#4C70F2' : '#7d7d8d'} strokeWidth="2" />
                            <path d="M10 22.5C10 20.567 11.567 19 13.5 19H22.5C24.433 19 26 20.567 26 22.5C26 24.433 24.433 26 22.5 26H13.5C11.567 26 10 24.433 10 22.5Z" stroke={path == "/profile" ? '#4C70F2' : '#7d7d8d'} strokeWidth="2" />
                        </svg>

                        <div className={`sm:mt-3 sm:ms-2 self-stretch text-center ${path == "/profile" ? 'text-[#4c6ff2]' : 'text-[#7d7d8d]'} text-xs font-semibold leading-none`}>
                            {t('Profile')}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}