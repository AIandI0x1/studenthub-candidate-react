/**
 * References 
 * ------------------------- 
 * https://github.com/mixpanel/mixpanel-js/issues/82
 * 
 */

import { store } from '@/store/store';
import { ca } from 'date-fns/locale';
import mixpanel from 'mixpanel-browser';


declare global {
  interface Window {
    analytics: any;
    gtag: any;
  }
}

export function setMixpanel() {

  if (typeof window == 'undefined') {
    return;
  }

  if (import.meta.env.VITE_MIXPANEL_KEY) { 
    try {
      mixpanel.init(import.meta.env.VITE_MIXPANEL_KEY+ "");
    } catch (error) { 
      console.log("mixpanel error", error);
    }
  }
}

/**
 * register user
 * @param id 
 * @param params 
 */
export function identify(id: string, params: any) {

  if (typeof window == 'undefined') {
    return;
  }
  //segment

  if (window.analytics)
    window.analytics.identify(id, {
      name: params.name,
      email: params.email,
    });

  //mixpanel 

  try {
    mixpanel.identify(id);

    mixpanel.people.set(params);
  } catch (error) { 
    console.log("mixpanel error", error);
  }
}

/**
 * page event
 * @param name 
 */
export function page(name: string) {

  if (typeof window == 'undefined') {
    return;
  }

  const state = store.getState(); // Get the state directly from the store

  const { language } = state.app;  

  if (window.analytics)
    window.analytics.page(name);

  /*mixpanel.track("Page View", {
    "name": name
  });*/

  try {
    const params = {
      language: language,
      channel: "Candidate Web App",
    }

    mixpanel.track("Page View", {
      "name": name,
      ...params
    });

    // track the elapsed time between a page viewed and page exit
    //call time_event with page_viewed event

    mixpanel.time_event("page_exit");
  } catch (error) { 
    console.log("mixpanel error", error);
  }

  if (typeof window.gtag != 'undefined') {
    window.gtag('event', 'page_view', {
      //page_title: title,
      page_path: location.pathname,
      page_location: location.href
    });
  }
}

/**
 * custom event
 * @param eventName 
 * @param params 
 */
export function track(eventName: string, params: any) {

  if (typeof window == 'undefined') {
    return;
  }

  const state = store.getState(); // Get the state directly from the store

  const { language } = state.app;  

  params.language = language;
  params.channel = "Candidate Web App";

  if (window.analytics)
    window.analytics.track(eventName, params);

  try {
    mixpanel.track(eventName, params);
  } catch (error) { 
    console.log("mixpanel error", error);
  }
}

export function refreshAnalytics() {

  if (typeof window == 'undefined') {
    return;
  }

  try {
    mixpanel.reset();
  } catch (error) { 
    console.log("mixpanel error", error);
  }
}  
