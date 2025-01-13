import { Button } from "@/components/ui/button";
import { Candidate } from "@/models/candidate";
import { useAppSelector } from "@/store/store";
import { MoreVertical } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"
import { CandidateAction } from "./action";
import { useHistory } from 'react-router-dom';
import { useEffect } from "react";

export function Name() {

    const { user } = useAppSelector(state => state.user) as { user: Candidate };
    const router = useHistory();

    useEffect(() => {
        //router.prefetch("/name?fromProfile=1");
        //router.prefetch("/personal-photo?fromProfile=1");
    }, []);
    
    const updateNameClicked = async () => {
        router.push('/name?fromProfile=1', {
            scroll: true
        });
    };

    const updatePhotoClicked = async () => {
        router.push('/personal-photo?fromProfile=1', {
            scroll: true
        });
    };

    return (
        <div className="w-full h-20 justify-start items-center gap-4 inline-flex mt-4">
            { user.candidate_personal_photo && <img className="w-20 h-20 relative rounded-[44px] cursor-pointer" onClick={updatePhotoClicked} src={import.meta.env.VITE_CLOUDINARY_URL + 'candidate-photo/' + 
                user.candidate_personal_photo} /> }
            { !user.candidate_personal_photo && <img src="/assets/images/avatar.jpg" /> }

            <div className="grow shrink basis-0 flex-col justify-start items-start gap-1 inline-flex">
                <div className="w-full justify-start items-center gap-6 inline-flex">
                    <div className="grow shrink basis-0 text-[#22223d] text-2xl font-bold leading-loose">
                        <span className="cursor-pointer" onClick={updateNameClicked}>{user.candidate_name}</span>

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" className="float-end">
                                    <MoreVertical size={24} />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-50 p-0">
                                <CandidateAction />
                            </PopoverContent>
                        </Popover>

                    </div>
                </div>
                <div className="justify-start items-center gap-6 inline-flex">
                    <div className="grow shrink basis-0 text-[#22223d] text-base font-bold leading-normal cursor-pointer" onClick={updateNameClicked}>
                        {user.candidate_name_ar} 
                    </div>
                </div>
            </div>
        </div>
    )
}