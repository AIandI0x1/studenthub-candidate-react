import { useEffect, useState } from "react";

export function Timer({ start, end = null}: { start: string, end?: string | null }) {
    //const [time, setTime] = useState('');
    const [hours, setHours] = useState<number>(0);
    const [minutes, setMinues] = useState<number>(0);
    const [rSeconds, setSeconds] = useState<number>(0);

    useEffect(() => {
  
      const date1 = new Date(start.replace(/-/g, '/') + ' GMT+03:00');
  
      const updateTimer = () => {
        let date2 = end ? new Date(end.replace(/-/g, '/') + ' GMT+03:00') : new Date();
   
        const diff = date2.getTime() - date1.getTime();
        const seconds = Math.round(Math.abs(diff / 1000));
   
        const rHours = Math.floor(seconds / 3600);
        const rMinutes = Math.floor((seconds % 3600) / 60);
        const rSeconds = seconds % 60;
   
        setHours(rHours); 
        setSeconds(rSeconds);
        setMinues(rMinutes);
      };
  
      updateTimer(); // Initial call
      const timerId = setInterval(updateTimer, 1000); // Update every second
  
      return () => clearInterval(timerId); // Cleanup on unmount
    }, [start, end]);
  
    return (
      <>
        <span className={ `text-[#fff2f2] text-[${hours == 0? '#f7acac':'#fff2f2'}] text-base font-medium` }>
            {hours < 10 ? '0' + hours : hours}:
        </span>
        <span className={ `text-[#fff2f2] text-[${hours != 0 && minutes == 0? '#f7acac':'#fff2f2'}] text-base font-medium` }>
            {minutes < 10 ? '0' + minutes : minutes}:
        </span>
        <span className={ `text-[#fff2f2] text-[${hours != 0 && minutes != 0 && rSeconds == 0? '#f7acac':'#fff2f2'}] text-base font-medium` }>
            {rSeconds < 10 ? '0' + rSeconds : rSeconds}
        </span>
      </>
    );
}
   