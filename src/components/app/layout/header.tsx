import Navigation from "./navigation";
import { useEffect } from "react";
import { useState } from "react";
import { StoreState, useAppSelector } from "@/store/store";
 
import { Bell, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link, useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import i18n from "@/18n";

export default function Header() {
    const router = useHistory();
    const [canGoBack, setCanGoBack] = useState(false);
    
    const { totalUnreadActivity, path } = useAppSelector((state: StoreState) => state.app);

    const { t} = useTranslation();

    useEffect(() => {
       // console.log("state", window.history, window.history.state.idx, window.history.state.length)
        if (typeof window !== 'undefined' && window.history && window.history.length > 1) {
            setCanGoBack(true);
            //setCanGoForward(true);
            //window.history.state && 
            //window.history.state.idx < window.history.state.length - 1
        }
    }, []);
    
    return (
        <>
            <div className="max-w-4xl mx-auto relative">
                
                <div className="py-7 xs:hidden sm:block">
                    <img src="/assets/icons/logo.svg" className="w-[167px] mx-auto " />
                </div>

                <Link to="/activity">
                <Button variant="ghost" 
                    className="xs:hidden sm:block absolute top-6 end-4">  
                    <Bell className="size-10" />
                    {totalUnreadActivity > 0 && <Badge variant={"destructive"} className="absolute end-[-5px] top-[-5px] rounded-full"  
                        color="warning">{totalUnreadActivity}</Badge>}
                </Button>
                </Link>
            </div>

            <Navigation></Navigation>

            <div className="max-w-4xl mx-auto relative bg-white">
            { canGoBack && path != "/home" && 
                <div className="xs:block sm:hidden px-6 py-4  bg-white">
                    <button onClick={() => router.goBack() } className="flex w-10 h-10 flex-col items-start gap-2.5 [background:var(--Neutral-20,#F5F5F7)] p-2 rounded-[20px]">
                      { i18n.language == "ar"? <ChevronRight className="stroke-[#7d7d8d]" />:  
                        <ChevronLeft className="stroke-[#7d7d8d]" /> }
                    </button>
                </div> }
    
                { path == "/home" && <h5 className='xs:block sm:hidden text-[color:var(--Neutral-95,#23233D)] text-2xl font-bold leading-8 capitalize p-6'>
                    {t('Home')}
                </h5> }

                <Link to="/activity">
                    <Button variant="ghost" 
                        className="sm:hidden absolute top-6 end-4">  
                        <Bell className="size-10" />
                        {totalUnreadActivity > 0 && <Badge variant={"destructive"} className="absolute end-[-5px] top-[-5px] rounded-full"  
                            color="warning">{totalUnreadActivity}</Badge>}
                    </Button>    
                </Link>
            </div>
        </>
    );
}