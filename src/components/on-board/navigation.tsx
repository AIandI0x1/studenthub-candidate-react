import { StoreState } from "@/store/store";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function OnboardNav() {

    const router = useHistory();

    const [canGoBack, setCanGoBack] = useState(false);
    //const [canGoForward, setCanGoForward] = useState(false);
    const { canGoForward } = useSelector((state: StoreState) => state.app);
    
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
        <div className="xs:hidden sm:inline-flex inline-flex h-8 justify-center items-center gap-1 shrink-0 border border-[color:var(--Neutral-30,#EEEEF0)] [background:var(--Neutral-10,#FAFAFA)] px-2 py-0 rounded-lg border-solid">
            
            <button onClick={() => router.goBack()} disabled={!canGoBack} className="border-e border-e-[#EEEEF0] ">
                <img alt="" src={ `/assets/icons/${canGoBack ? 'up-arrow' : 'up-arrow-disabled'}.svg` } className="disabled:fill-[#EEEEF0]" />
            </button>
            <button onClick={() => router.goForward()} disabled={!canGoForward}>
                <img alt="" src={ `/assets/icons/${canGoForward ? 'down-arrow' : 'down-arrow-disabled'}.svg` } className="disabled:fill-[#EEEEF0]" />
            </button>
        </div>
    )
}