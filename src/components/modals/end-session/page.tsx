"use client"
import { Backdrop } from '@/components/common/backdrop';
// app/(dash)/end-session/page.tsx

import { page, track } from '@/providers/analytics.service';
import { CircleX, X } from 'lucide-react';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next'; // Assuming you have a translation hook

const EndSessionPage = ({ onClose }: { onClose: any }) => {
  const { t } = useTranslation();

  useEffect(() => {
    page('End session page');

    return () => {
      track('page_exit', { page: 'End session page' });
    }
  }, []);

  return (
    <div className='inset-0 flex items-center justify-center'>
      <Backdrop onClick={() => onClose()}></Backdrop>
 
      <div className="fixed 

        xs:bottom-[0] xs:w-full xs:start-0

        sm:top-[calc(50%-122px)] sm:start-[calc(50%-244px)] sm:w-[488px] sm:rounded-[30px]

        h-[256px] bg-white xs:rounded-tl-[30px] xs:rounded-tr-[30px]">
 
        <div className='p-6 border-b border-[color:var(--Neutral-40,#E2E2E6)]'>
          <h5 className=" text-[#22223d] text-xl font-bold leading-7">
              {t("End Session?")}

              <button onClick={() => onClose()} className='bg-[#f5f5f7] rounded-full w-10 h-10 p-2 items-center text-center float-end'>
                <X className="h-6 w-6 fill-[#7d7d8d] text-[#7d7d8d]" aria-hidden="true" />
              </button>
          </h5>
        </div>
        <div className='p-6'>

          <p className=" text-[#4b4b61] text-base font-normal leading-normal mb-6 mt-0">
            {t("Do you want to end and submit this session? you can start more sessions later.")}
          </p>

          <div className="justify-start items-start gap-4 inline-flex">
              <button className="w-[140px] h-14 shrink-0 border-[color:var(--Neutral-80,#68687A)] [background:var(--Neutral-0,#FFF)] rounded-xl border-2 border-solid
                  text-[#68687a] text-base font-semibold leading-normal"
                onClick={() => onClose({ discard: true })}
              >
                {t("End & Discard")}
              </button>

              <button
                className="w-[186px] h-14  bg-[#4c6ff2] rounded-xl text-center text-white text-base font-semibold leading-normal"
                onClick={() => onClose({ submit: true })}>
                {t("Stop & Submit")}
              </button>

              <div className='clearfix'></div>
          </div>

          <div className='clearfix'></div>
        </div>  
      </div>
    </div>
  );
};

export default EndSessionPage;