
import { IonApp, IonRouterOutlet, setupIonicReact, useIonRouter } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
//import { Inter } from 'next/font/google';

//const inter = Inter({ subsets: ['latin'] });

import { setCanGoForward } from "@/store/slices/appSlice";
import { useEffect } from "react";
import { setMixpanel } from "@/providers/analytics.service";
import i18n from "./18n";
import './sentry';

declare global {
  interface Window {
    OneSignal: any;
  }
}

window.global ||= window;




/* Core CSS required for Ionic components to work properly *
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic *
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out *
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; *
import '@ionic/react/css/palettes/dark.system.css';

*/

import './theme/global.css';

/* Theme variables */
import './theme/variables.css';

import { store } from './store/store';
import React from 'react';
import { initializeApp, updateAlert } from './init';
import { ErrorBoundary } from '@sentry/react';
import { Provider } from 'react-redux';
import RouterComponent from './router';
import { useAlertDialog } from './hooks/use-alert-dialog';
 
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { t } from "i18next";
import { Toaster } from "@/components/ui/toaster";

//const LandingPage = React.lazy(() => import('./pages/(auth)/landing/page'));
//const HomePage = React.lazy(() => import('./pages/(dash)/home/page'));

setupIonicReact();

if (typeof window !== 'undefined') {
  window.onpopstate = (event) => { 
    store.dispatch(setCanGoForward({canGoForward: true}));
  }
}


const App: React.FC = () => {
  
  const { alertDialogs } = useAlertDialog();

  useEffect(() => {

    initializeApp();

    document.getElementsByTagName('html')[0].setAttribute('dir', 
      (i18n.language == 'ar') ? 'rtl' : 'ltr');


    setMixpanel();
  }, []);

  return (
    <ErrorBoundary>
    <Provider store={store}>
      
      <IonApp className={ (i18n.language == 'ar') ? 'font-droid' : 'font-inter'}>
        <IonReactRouter>
          <IonRouterOutlet>
            <RouterComponent />
          </IonRouterOutlet>
        </IonReactRouter>
      </IonApp>

      <Toaster />

      {/*<AlertDialogs />*/}
      {alertDialogs.map((alertDialog, index) => {
        return (
          <AlertDialog key={index} {...alertDialog}>
            {/**<AlertDialogTrigger asChild>
              <Button variant="outline">Show Dialog</Button>
            </AlertDialogTrigger> */}
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{alertDialog.title}</AlertDialogTitle>
                { alertDialog.description && <AlertDialogDescription 
                  dangerouslySetInnerHTML={{__html: ""+ alertDialog.description}}>
                </AlertDialogDescription> }
              </AlertDialogHeader>
              <AlertDialogFooter>
                {/**<AlertDialogCancel>Cancel</AlertDialogCancel> */}
                <AlertDialogAction>{t('Continue')}</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        );
      })}
    </Provider>
    </ErrorBoundary>
  );
};

export default App;
