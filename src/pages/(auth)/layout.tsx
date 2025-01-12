"use client"

//import type { Metadata } from "next";
import OnboardHeader from "@/components/on-board/layout/header";
import { setAWSConfig } from "@/providers/logged-in/aws.service";
import { useEffect } from "react";
 
/*export const metadata: Metadata = {
  title: 'StudentHub - Your Learning Journey Starts Here',
  description: 'Join StudentHub to start your educational journey with the best resources and support.',
};*/

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  useEffect(() => {
    setAWSConfig();
  }, []);

  return (
    <>
      <OnboardHeader></OnboardHeader>
      <div className="max-w-5xl mx-auto p-[24px]" suppressHydrationWarning={true}>
        {children}
      </div>
    </>
  );
}
