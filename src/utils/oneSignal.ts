import { store } from "@/store/store";
import { setOneSignalStatus, setPushNotificationAvailable, setShowOneSignalPrompt } from "@/store/slices/appSlice";

const state = store.getState(); // Get the state directly from the store

const { oneSignalStatus } = state.app;
const { user } = state.user;

let notificationScriptLoaded = false;

/**
 * set oneSignal subscription for browser
 */
export async function setOneSignalSubscription() {

  if(window && window.Notification && window.OneSignal)
  {
    const OneSignal = window.OneSignal || [];

    OneSignal.setSubscription(true);
    OneSignal.registerForPushNotifications();

    // send user tag, to target based on tags

    const tags = {
      'candidate_id': user?.candidate_id + '',
      'name': user?.candidate_name,
      'email': user?.candidate_email
    };

    OneSignal.sendTags(tags);
  }

  store.dispatch(setShowOneSignalPrompt({
    showOneSignalPrompt: false
  }));

  store.dispatch(setOneSignalStatus({
    oneSignalStatus: true
  }));
}

/**
 * check oneSignal subscription status to show prompt in conversation list page
 */
export async function oneSignalActionBasedOnStatus() {
  console.log("oneSignalActionBasedOnStatus", oneSignalStatus);
  if (oneSignalStatus) { // already accepted
    setOneSignalSubscription();
  } else { // not sure
    checkOneSignalStatus();
  } 
}

/**
 * check oneSignal subscription status for browser
 */
async function checkOneSignalStatus() {

  if (window && window.OneSignal && window.Notification) {

    const OneSignalw = window.OneSignal || [];

    OneSignalw.isPushNotificationsEnabled((isEnabled: any) => {

      if (isEnabled) {

        // Automatically subscribe user if deleted cookies and browser shows "Allow"

        OneSignalw.getUserId().then((userId: any) => {

          // remove old user tag if any

          if (userId) {

            const tags = [
              'candidate_uuid',
              'name',
              'email'
            ];

            OneSignalw.deleteTags(tags);
          }

          // if (!userId) {

          OneSignalw.setSubscription(true);
          OneSignalw.registerForPushNotifications();

          // send user tag, to target based on tags

          const tags = {
            'candidate_id': user?.candidate_id + '',
            'name': user?.candidate_name,
            'email': user?.candidate_email
          };

          OneSignalw.sendTags(tags);

          // }
        });
      } else {
        store.dispatch(setShowOneSignalPrompt({
          showOneSignalPrompt: true
        }));
      }
    });

    // Occurs when the user's subscription changes to a new value.

    OneSignalw.on('subscriptionChange', (isSubscribed: any) => {
      store.dispatch(setShowOneSignalPrompt({
        showOneSignalPrompt: !isSubscribed
      }));
    });
  }
}

/**
 * Include One signal to use stripe element in browser
 */
export async function includeOneSignalJs() {

  console.log("_includeOneSignalJs");

  if (!window.Notification) {
    console.log("window.Notification not available");
    store.dispatch(setPushNotificationAvailable({
      pushNotificationAvailable: false
    }));
    return null; // only for browser
  }

  /**
   * https://sentry.io/organizations/pogi/issues/1843000885/?project=5339282&referrer=slack
   * Cannot read property 'pushNotification' of undefined
   */

  const agent = window.navigator.userAgent.toLowerCase();
  //agent.indexOf('safari') > -1 && (!window.safari || !window.safari.pushNotification)
  console.log("agent", agent);
  //this.platform.is('ios') 
  if(/iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream) {
    console.log("window.Notification not available");
    store.dispatch(setPushNotificationAvailable({
      pushNotificationAvailable: false
    }));
    return null; // ios browser not supporting push notification
  } else {
    store.dispatch(setPushNotificationAvailable({
      pushNotificationAvailable: true
    }));
  }

  // if already loaded, just update tags

  if (window.OneSignal) {
    return oneSignalActionBasedOnStatus();
  }

  // if already initialized

  if (notificationScriptLoaded) {
    return null;
  }

  //setNotificationScriptLoaded(true);
  notificationScriptLoaded = true;

  // load script and call callback to initialize

  const callback = () => {

    const wOneSignal = window.OneSignal || [];

    wOneSignal.push(() => {

      // initialize only on first time script load

      console.log("ONE_SIGNAL_APP_ID", import.meta.env.VUE_ONE_SIGNAL_APP_ID);
      console.log("ONE_SIGNAL_SAFARI_APP_ID", import.meta.env.VUE_ONE_SIGNAL_SAFARI_APP_ID);

      wOneSignal.init({
        appId: import.meta.env.VUE_ONE_SIGNAL_APP_ID,
        safari_web_id: import.meta.env.VUE_ONE_SIGNAL_SAFARI_APP_ID,
        autoRegister: false,
        httpPermissionRequest: {
          enable: false
        },
        promptOptions: {
          customlink: {
            enabled: true
          }
        }
      });

      oneSignalActionBasedOnStatus();
    });
  };

  loadScript('https://cdn.onesignal.com/sdks/OneSignalSDK.js', callback);
}

/**
 * Load javascripts dynamically
 * @param url
 * @param callback
 */
async function loadScript(url: string, callback : () => void = () => {}) {
  const body = document.body;
  const script = document.createElement('script');
  script.innerHTML = '';
  script.src = url;
  script.async = false;
  script.defer = true;

  if (callback) {
    script.addEventListener('load', callback);
  }

  body.appendChild(script);
}