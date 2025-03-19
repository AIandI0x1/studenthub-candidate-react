import { alertDialog } from "@/hooks/use-alert-dialog";
import { CandidateLink } from "@/models/candidate-link"
import { deleteCandidateLink } from "@/providers/logged-in/candidate-link.service";
import { useTranslation } from "react-i18next";
import { errorMessage } from "@/utils/common";
import { setUser } from "@/store/slices/userSlice";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { Candidate } from "@/models/candidate";
import { toast } from "@/hooks/use-toast";
import { CandidateLinkForm } from "./candidate-link-form";
import { useState } from "react";
import { DialogContent } from "@/components/ui/dialog";
import { Dialog } from "@/components/ui/dialog";
import { DialogTrigger } from "@/components/ui/dialog";

const CandidateLinkComponent = ({ candidateLink }: { candidateLink: CandidateLink }) => {

    const { t } = useTranslation();

    const dispatch = useAppDispatch();

    const { user } = useAppSelector(state => state.user) as { user: Candidate };

    const [open, setOpen] = useState(false);

    const deleteLink = () => {
        deleteCandidateLink(candidateLink.cl_uuid).then((response: any) => {
            if (response.operation == "success") {
                toast({
                    title: t("Success"),
                    description: t("Link deleted successfully"),
                });

                dispatch(setUser({ user: {
                    ...user,
                    candidateLinks: response.candidateLinks 
                } }));
                
            } else {
                alertDialog({
                    title: t("Error"),
                    description: errorMessage(response.message),
                });
            }
        }).catch((error: any) => {
            console.log(error);
        });
    } 

    return (
        <div className="self-stretch flex flex-col justify-start items-start gap-4 w-full my-4">
            <div className="self-stretch p-4 bg-white rounded-lg shadow-[0px_2px_4px_0px_rgba(0,0,0,0.10)] flex flex-col justify-start items-start gap-2.5">
                <div className="self-stretch inline-flex justify-start items-center gap-3">
                    <div className="flex-1 flex justify-start items-center gap-3">
                        <div onClick={() => window.open(candidateLink.url, "_blank")} className="cursor-pointer w-[18px] h-[18px] relative overflow-hidden">
                            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13.5 9.75V14.25C13.5 14.6478 13.342 15.0294 13.0607 15.3107C12.7794 15.592 12.3978 15.75 12 15.75H3.75C3.35218 15.75 2.97064 15.592 2.68934 15.3107C2.40804 15.0294 2.25 14.6478 2.25 14.25V6C2.25 5.60218 2.40804 5.22064 2.68934 4.93934C2.97064 4.65804 3.35218 4.5 3.75 4.5H8.25" stroke="#7D7D8D" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M11.25 2.25H15.75V6.75" stroke="#7D7D8D" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
                                <path d="M7.5 10.5L15.75 2.25" stroke="#7D7D8D" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                        </div>
                        <div className="flex-1 inline-flex flex-col justify-start items-start gap-1">
                            <div className="self-stretch justify-start text-[#22223d] text-base font-semibold font-['Inter'] leading-normal">
                                {candidateLink.title}
                            </div>
                        </div>
                    </div>
                    
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <button className="p-2 bg-white inline-flex justify-center items-center gap-2">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M7.86612 18.6339C7.37796 18.1457 7.37796 17.3543 7.86612 16.8661L12.9822 11.75L7.86612 6.63389C7.37796 6.14573 7.37796 5.35427 7.86612 4.86612C8.35427 4.37796 9.14573 4.37796 9.63389 4.86612L15.6339 10.8661C16.122 11.3543 16.122 12.1457 15.6339 12.6339L9.63388 18.6339C9.14573 19.122 8.35427 19.122 7.86612 18.6339Z" fill="#7D7D8D"/>
                                </svg>
                            </button>
                        </DialogTrigger> 
                        <DialogContent className="sm:max-w-[425px]">
                            <CandidateLinkForm candidateLink={candidateLink} onClose={() => setOpen(false)} />
                        </DialogContent>
                    </Dialog>
                     
                    <div onClick={() => deleteLink()} className="cursor-pointer w-[30px] h-[30px] overflow-hidden">
                        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18.75 11.25L11.25 18.75" stroke="#FB7185" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M11.25 11.25L18.75 18.75" stroke="#FB7185" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                </div>
            </div>
        </div> 
    )
}

export default CandidateLinkComponent;