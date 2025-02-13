import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

// Import your reducers
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import appReducer from './slices/appSlice';
import { Storage } from '@ionic/storage';

const storage = new Storage();
await storage.create();

export type StoreState = {
  auth: ReturnType<typeof authReducer>;
  user: ReturnType<typeof userReducer>;
  app: ReturnType<typeof appReducer>;
}

const loadState = async () => {
  try {
    const serializedState = await storage.get('state');
    
    if (!serializedState) 
      return undefined
    return JSON.parse(serializedState)
  } catch (err) {
    return undefined
  }
}

export const store = configureStore<StoreState>({
  preloadedState: await loadState(),
  reducer: {
    auth: authReducer,
    user: userReducer,
    app: appReducer,
  },
});


// Save to local storage
store.subscribe(async () => {
   
  const state = {
    ...store.getState(),
    app: {
      ...store.getState().app,
      canGoForward: false,
      path: ""
    }
  };

  await storage.set('state',   
    JSON.stringify(state)
  ) 
});

// Types for hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;