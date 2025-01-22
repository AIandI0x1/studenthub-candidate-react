import { store } from "@/store/store";
import { setOneSignalStatus, setPushNotificationAvailable, setShowOneSignalPrompt } from "@/store/slices/appSlice";

const state = store.getState(); // Get the state directly from the store

const { oneSignalStatus } = state.app;
const { user } = state.user;

//let notificationScriptLoaded = false;

/**
 * set oneSignal subscription for browser
 */
export async function setOneSignalSubscription() {

  if(window && window.Notification && window.OneSignal)
  {
    const wOneSignal = window.OneSignal || [];

    wOneSignal.User.PushSubscription.optIn();
    //OneSignal.setSubscription(true);
    //OneSignal.registerForPushNotifications();

    // send user tag, to target based on tags

    const tags = {
      'candidate_id': user?.candidate_id + '',
      'name': user?.candidate_name,
      'email': user?.candidate_email
    };

    wOneSignal.User.addTags(tags);
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

    const wOneSignal = window.OneSignal || [];

    if (wOneSignal.User.PushSubscription.optedIn) {

      // Automatically subscribe user if deleted cookies and browser shows "Allow"

      /*if (wOneSignal.User.PushSubscription.id)

        // remove old user tag if any
 
          const oldTags = [
            'candidate_uuid',
            'name',
            'email'
          ];

          wOneSignal.User.removeTags(oldTags);
        }*/

        // if (!userId) {
 
       // wOneSignal.User.PushSubscription.optIn();
        //OneSignal.setSubscription(true);
        //OneSignal.registerForPushNotifications();

        // send user tag, to target based on tags

        const tags = {
          'candidate_id': user?.candidate_id + '',
          'name': user?.candidate_name,
          'email': user?.candidate_email
        };

        wOneSignal.User.addTags(tags);
        // }
      
    } else {
      store.dispatch(setShowOneSignalPrompt({
        showOneSignalPrompt: true
      }));
    } 

    // Occurs when the user's subscription changes to a new value.

    wOneSignal.User.PushSubscription.addEventListener('change', (event: any) => {
      store.dispatch(setShowOneSignalPrompt({
        showOneSignalPrompt: !event.current.optedIn
      }));
    });
  }
}

/**
 * Include One signal to use stripe element in browser
 */
export async function includeOneSignalJs() {
 
  if (!window.Notification) {
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
 
  //this.platform.is('ios') 
  if(/iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream) {
    store.dispatch(setPushNotificationAvailable({
      pushNotificationAvailable: false
    }));
    return null; // ios browser not supporting push notification
  } else {
    store.dispatch(setPushNotificationAvailable({
      pushNotificationAvailable: true
    }));
  }

  if (window.OneSignalDeferred && window.OneSignalDeferred.length > 0) {
    return;
  }

//  console.log("c62352ca-2f6c-44a2-896c-84c2f17db9ac", import.meta.env.VITE_ONE_SIGNAL_APP_ID);

  {/**
    <div class='onesignal-customlink-container'></div> */}
  window.OneSignalDeferred = window.OneSignalDeferred || [];
  window.OneSignalDeferred.push(async (OneSignal: any) => {
    await OneSignal.init({
      appId: import.meta.env.VITE_ONE_SIGNAL_APP_ID,
      safari_web_id: import.meta.env.VITE_ONE_SIGNAL_SAFARI_APP_ID,
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
/*
  const wOneSignal = window.OneSignal || [];

  wOneSignal.push(async (OneSignal: any) => {

    // initialize only on first time script load

    await OneSignal.init({
      appId: import.meta.env.VITE_ONE_SIGNAL_APP_ID,
      safari_web_id: import.meta.env.VITE_ONE_SIGNAL_SAFARI_APP_ID,
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

    
  });

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

  //const callback = () => {

  //};

  //loadScript('https://cdn.onesignal.com/sdks/OneSignalSDK.js', callback);*/
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