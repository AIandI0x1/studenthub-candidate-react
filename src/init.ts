//const dispatch = useAppDispatch

const state = store.getState(); // Get the state directly from the store

const { isAuthenticated } = state.auth;  
const { user } = state.user;

import { unreadCount } from "@/providers/logged-in/chat.service";
import { alertCount$, alertUpdate$, setOneSignal$, userLogin$, userLogout$ } from "@/providers/event.service";

import { loginByKey } from "@/providers/auth.service";
import { getJobSearchStatus, profile } from "@/providers/logged-in/account.service";
import { setUser } from "@/store/slices/userSlice";
import { clickCampaign } from "@/providers/campaign.service";
import { setCampaignId, setTotalUnreadActivity, setTotalUnreadMessages } from "@/store/slices/appSlice";
import { identify, setMixpanel, track } from "@/providers/analytics.service";
import { store } from "./store/store";
import { includeOneSignalJs, oneSignalActionBasedOnStatus, setOneSignalSubscription } from "./utils/oneSignal";
import { logout } from "./store/slices/authSlice";

declare global {
    interface Window {
      OneSignal: any;
      OneSignalDeferred: any;
    }
}
window.global ||= window;

let alertSubscription: any = null;
let isInitialized = false;

export async function initializeApp(urlParams: any) {

    if(isInitialized) {
      return;
    }

    isInitialized = true;
 
    if(urlParams.get('utm_id')) {
      
      store.dispatch(setCampaignId({
        utm_uuid: urlParams.get('utm_id') +''
      }));
      
      await clickCampaign(urlParams.get('utm_id') + '');
 
      track("From Campaign", {
        "utm_id": urlParams.get('utm_id'),
        "utm_source": urlParams.get('utm_source'),
        "utm_medium": urlParams.get('utm_medium'),
        "utm_campaign": urlParams.get('utm_campaign'),
        "utm_term": urlParams.get('utm_term'),
        "utm_content": urlParams.get('utm_content'),
      });
    }

    if (isAuthenticated && user) {
      identify(user.candidate_id + '', {
        name: user.candidate_name,
        email: user.candidate_email,
      });
    }

    if (isAuthenticated) {
      updateAlert();
      alertSubscribe();
    }
    
    // On Login Event, set root to Internal app page
    userLogin$.subscribe((data: any) => {

      profile().then(res => {
        store.dispatch(setUser({ user: res }));

        identify(res.candidate_id, {
          name: res.candidate_name,
          email: res.candidate_email,
        });
      });

      oneSignalActionBasedOnStatus();

      updateAlert();

      alertSubscribe();
     // router.push('/home');
    });

    setOneSignal$.subscribe(() => {
      setOneSignalSubscription();
    });
    // On Logout Event, set root to Login Page
    userLogout$.subscribe((logoutReason) => {

      store.dispatch(logout());
 
      if (alertSubscription) {
        clearInterval(alertSubscription);
        alertSubscription = null;
      }
      
      // unsubscribe from oneSignal

      if (window && window.Notification && window.OneSignal)
      {
        const wOneSignal = window.OneSignal;

        if (
          wOneSignal.User && 
          wOneSignal.User.PushSubscription && 
          wOneSignal.User.PushSubscription.id
        ) {

          // remove old user tag if any
   
            const oldTags = [
              'candidate_uuid',
              'name',
              'email'
            ];
  
            wOneSignal.User.removeTags(oldTags);
        }
      }

      // Show Message explaining logout reason if there's one set
      if (logoutReason) {
        console.log(logoutReason);
      }
    });

    /**
     * Update alert count
     */
    alertUpdate$.subscribe(() => {
      updateAlert();
    });

    includeOneSignalJs();

    //setTimeout(() => {
      setMixpanel();
    //}, 1000);
  }

  /**
    * Get notification count after every minute
    */
  async function alertSubscribe() {
    if (alertSubscription) {
      return null;
    }

    alertSubscription = setInterval(() => {
      updateAlert();
    }, 3 * 1000);
  }

  /**
   * Update alert count on app
   */
  export async function updateAlert() {

    if (!navigator.onLine) {
      return false;
    }
    
    unreadCount().then(async data => {

      if (data.operation && data.operation == 'error') {
        /*const toast = await this.toastCtrl.create({
          message: this.translateService.transform('Account deactivated'),
          duration: 3000,
          position: 'top',
          cssClass: 'error_toast_' + this.translateService.direction()
        });
        await toast.present();

        store.dispatch(logout());
        router.push("/");   */
        
        userLogout$.next({});
      } 
      else 
      {
        alertCount$.next(data);

        /*store.dispatch(setPendingInvitations({
          pendingInvitations: data.pendingInvitations
        }));*/

        store.dispatch(setTotalUnreadActivity({
          totalUnreadActivity: data.totalUnreadActivity
        }));

        store.dispatch(setTotalUnreadMessages({
          totalUnreadMessages: data.total,
        }));
      }
    });
  }

  async function loadJobSearchStatus() {

    //loadingJobSearchStatus = true;

    getJobSearchStatus().then(res => {

      store.dispatch(setUser({
        user: {
          ...user,
          candidate_job_search_status: res.candidate_job_search_status
        }
      }));
       
      //this.authService.store = res.store;

      //this.authService.company = (res.parent_company) ? res.parent_company : res.company;

      /*if(!res.isProfileCompleted) {

        this.authService.isProfileCompleted = false;
        this.authService.saveLoggedInUser();

        this.navCtrl.navigateRoot(['/complete-profile']);
      }*/
    });
  }
