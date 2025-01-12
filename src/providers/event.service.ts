import { Subject } from 'rxjs';
  
export const internetOffline$ = new Subject();
export const error404$ = new Subject();
export const error500$ = new Subject();
export const errorStorage$ = new Subject();
  
export const userLogout$ = new Subject();
export const userLogin$ = new Subject();
export const userUpdated$ = new Subject();
export const nameUpdated$ = new Subject();
export const bankUpdated$ = new Subject();
export const profileUrlUpdated$ = new Subject();

export const setOneSignalSubscription$ = new Subject();
export const setOneSignal$ = new Subject();

export const setLanguagePref$ = new Subject();
export const kuwaitiNationl$ = new Subject();

export const candidateVideoProcessed$ = new Subject();

export const tabScrolled$ = new Subject();
export const requestUpdated$ = new Subject();

export const startWork$ = new Subject();
export const stopWork$ = new Subject();

export const workStarted$ = new Subject();
export const workStopped$ = new Subject();

export const loadProfile$ = new Subject();

export const googleLoginFinished$ = new Subject();

export const locationUpdated$ = new Subject();

export const civilUpdated$ = new Subject();

export const alertCount$ = new Subject();
export const alertUpdate$ = new Subject();
 