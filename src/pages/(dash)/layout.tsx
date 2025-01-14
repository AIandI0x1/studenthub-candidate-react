

import Header from "@/components/app/layout/header";

//import type { Metadata } from "next";
 
/*export const metadata: Metadata = {
  title: 'StudentHub - Your Learning Journey Starts Here',
  description: 'Join StudentHub to start your educational journey with the best resources and support.',
};*/
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { startChat } from "@/providers/logged-in/chat.service";
import { errorMessage } from "@/utils/common";
import { useIonRouter } from "@ionic/react";  
import { LoaderCircle, MessagesSquare } from "lucide-react";
import { StoreState, useAppDispatch, useAppSelector } from "@/store/store";
import { countInvitations } from "@/providers/logged-in/invitation.service";
import { requestUpdated$ } from "@/providers/event.service";
import { setPendingInvitations } from "@/store/slices/appSlice";
import { alertDialog } from "@/hooks/use-alert-dialog";
import { useTranslation } from "react-i18next";

export default function DashLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { t } = useTranslation();

  const [startingChat, setStartingChat] = useState(false);
   
  const { totalUnreadMessages} = useAppSelector((state: StoreState) => state.app);
  const { user } = useAppSelector((state: StoreState) => state.user);
  const router = useIonRouter();

  const dispatch = useAppDispatch();

  const { isAuthenticated } = useAppSelector((state: StoreState) => state.auth);
  const { pendingInvitations } = useAppSelector((state: StoreState) => state.app);
  
  const startChatClicked = () => {
    setStartingChat(true);
 
    startChat().then(async res => {
      setStartingChat(false);
    
      if (res.operation == "error") {
        alertDialog({
          title: t("Error"),
          description: errorMessage(res.message),
        });
      }
      else 
      {
        router.push('/chat/' + res.chat.chat_uuid);
      }
    });
  };

  useEffect(() => {
    loadInvitations();

    const invitationInterval = setInterval(() => {
      if (isAuthenticated && navigator.onLine) {
        loadInvitations();
      }
    }, 1000 * 30); // every 30 second 

    //prefetch tabs 
    setTimeout(() => {
      //router.prefetch("/invitation");
      //router.prefetch("/work-log/track-work");
      //router.prefetch("/payments");
      //router.prefetch("/discounts");
      //router.prefetch("/profile");
      //router.prefetch("/chat/[id]")
    }, 2000); //after 2 second

    return () => {
      clearInterval(invitationInterval);
    };
  }, []);

  /**
   * load invitations for request
   */
  function loadInvitations() {

    countInvitations().then((count: any) => {
      const total = parseInt(count);

      if (pendingInvitations != total) {
        requestUpdated$.next({});
      }
 
      dispatch(setPendingInvitations({
        pendingInvitations: total
      }));
    });
  }

  return (
    <div className="bg-[#f7f8fa] min-h-screen xs:pb-20 sm:pb-0">

      <Header></Header>
{/** className="max-w-5xl mx-auto p-[24px]" */}
      <div suppressHydrationWarning={true}>
        {children}
      </div>
      
      { user?.store_id && 
      <div className="fixed end-4 xs:bottom-16 sm:bottom-4" id="btn-chat">
        <Button className="btn-fab rounded-full p-4 w-10 h-10" onClick={startChatClicked}>
          {!startingChat ? (
            <MessagesSquare className="w-6" />
          ) : (
            <LoaderCircle className="w-6 animate-spin" />
          )}
        </Button>
        {totalUnreadMessages >0 && <Badge variant={"destructive"} className="absolute end-[-5px] top-[-5px] rounded-full" color="warning">{totalUnreadMessages}</Badge>}
      </div> }
      
    </div>
  );
}
