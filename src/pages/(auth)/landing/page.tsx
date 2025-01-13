"use client"

import { Hero } from "@/components/on-board/hero";
import AuthLayout from "../layout";
//import { logout } from "@/store/slices/authSlice";
//import { useEffect } from "react";
//import { useIonRouter } from '@ionic/react';

export default function LandingPage() {
 
  /*//const dispatch = useAppDispatch();
  const { isAuthenticated } = store.getState().auth;// useAppSelector((state) => state.auth);

  useEffect(() => {
    
    const router = useRouter();

    if (isAuthenticated) {
      
      //router.push("/home");
    }
  }, []);*/
 
  return <AuthLayout>  
    <Hero /> 
  </AuthLayout>;
}
