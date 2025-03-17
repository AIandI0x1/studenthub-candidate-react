import { createSlice, PayloadAction } from '@reduxjs/toolkit';
//import mixpanel from "mixpanel-browser";

interface AppState {
  language: string;
  mixpanel_distinct_id: string | null;
  temp_bucket: string;
  utm_uuid: string;
  currentLocation: any;
  showOneSignalPrompt: boolean,
  oneSignalStatus: boolean,
  pushNotificationAvailable: boolean,
  canGoForward: boolean,
  totalUnreadActivity: number,
  totalUnreadMessages: number,
  pendingInvitations: number,
  path: string
}

const initialState: AppState = {
  language: "ar",
  mixpanel_distinct_id: null,//mixpanel.get_distinct_id()
  temp_bucket: "studenthub-public-anyone-can-upload-24hr-expiry",
  utm_uuid: "",
  currentLocation: null,
  showOneSignalPrompt: true,
  oneSignalStatus: false,
  pushNotificationAvailable: false,
  canGoForward: false,
  totalUnreadActivity: 0,
  totalUnreadMessages: 0,
  pendingInvitations: 0,
  path: ""
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<{ language: string }>) => {

      state.language = action.payload.language;
      //i18n.changeLanguage(action.payload.language);

      document.getElementsByTagName('html')[0].setAttribute('dir', 
        (action.payload.language == 'ar') ? 'rtl' : 'ltr');

    },
    setTempBucket: (state, action: PayloadAction<{ temp_bucket: string }>) => {
      state.temp_bucket = action.payload.temp_bucket;
    },
    setCampaignId: (state, action: PayloadAction<{ utm_uuid: string }>) => {
      state.utm_uuid = action.payload.utm_uuid;
    },
    setCurrentLocation: (state, action: PayloadAction<{ currentLocation: any }>) => {
      state.currentLocation = action.payload.currentLocation;
    },
    // if active/ inactive etc
    setOneSignalStatus: (state, action: PayloadAction<{ oneSignalStatus: boolean }>) => {
      state.oneSignalStatus = action.payload.oneSignalStatus;
    },
    // to show prompt to enable 
    setShowOneSignalPrompt: (state, action: PayloadAction<{ showOneSignalPrompt: boolean }>) => {
      state.showOneSignalPrompt = action.payload.showOneSignalPrompt;
    },
    // if browser support notification 
    setPushNotificationAvailable: (state, action: PayloadAction<{ pushNotificationAvailable: boolean }>) => {
      state.pushNotificationAvailable = action.payload.pushNotificationAvailable;
    },
    setCanGoForward: (state, action: PayloadAction<{ canGoForward: boolean }>) => {
      state.canGoForward = action.payload.canGoForward;
    },
    setTotalUnreadActivity: (state, action: PayloadAction<{ totalUnreadActivity: number }>) => {
      state.totalUnreadActivity = action.payload.totalUnreadActivity;
    },
    setTotalUnreadMessages: (state, action: PayloadAction<{ totalUnreadMessages: number }>) => {
      state.totalUnreadMessages = action.payload.totalUnreadMessages;
    },
    setPendingInvitations: (state, action: PayloadAction<{ pendingInvitations: number }>) => {
      state.pendingInvitations = action.payload.pendingInvitations;
    },
    setPath: (state, action: PayloadAction<{ path: string }>) => {
      state.path = action.payload.path;
    }, 
  },
});

export const { setLanguage, setTempBucket, setCampaignId, setCurrentLocation, 
  setShowOneSignalPrompt, setCanGoForward, setTotalUnreadActivity, setTotalUnreadMessages, 
  setOneSignalStatus, setPendingInvitations, setPushNotificationAvailable, setPath } = appSlice.actions;
export default appSlice.reducer;