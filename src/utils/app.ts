import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';

export const calculateAge = (value: string) => {
    const { t } = useTranslation();

    let d = value ? new Date(value.replace(/-/g, '/') + ' GMT+03:00') : new Date();
    let now = new Date();

    let seconds = Math.round(Math.abs((now.getTime() - d.getTime()) / 1000));
    let minutes = Math.round(Math.abs(seconds / 60));
    let hours = Math.round(Math.abs(minutes / 60));
    let days = Math.round(Math.abs(hours / 24));
    let years = Math.floor(Math.abs(days / 365));

    if (Number.isNaN(seconds)) {
      return '';
    } else if (days <= 545) {
      return t('a year old'); // Translation for "a year old"
    } else { // (days > 545)
      return t('txt_years_old', { value: years }); // Translation for "X years old"
    }
}; 

/**
   * Convert To Bold
   */
export function convertToBold(value: string) {
    if(value)
      return  value.replace(/\*([^*]+)\*/g , '<b>$1</b>');
  }

  export function groupBy(value: any, attribute: string) {
        const groups: any = {};
    
        value.forEach((o: any) => {
    
          const group = format(parseISO(o[attribute]), 'MMMM, yyyy'); 
     
    
          groups[group] = groups[group] ?
             groups[group] : { 
              name: group, 
              resources: [] 
            };
            
          groups[group].resources.push(o);
        });
    
        return Object.keys(groups).map(key => groups[key]);
  }

  export function secondsToTime(value: number ): string {
    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value % 3600) / 60);
    const seconds = value % 60;

    const hoursString = hours.toString().padStart(2, '0');
    const minutesString = minutes.toString().padStart(2, '0');
    const secondsString = seconds.toString().padStart(2, '0');

    return `${hoursString}:${minutesString}:${secondsString}`;
  }

  export function split(val:string, params: any):string | undefined {
    if(val)
        return val.split(params)[0];
}

export const useTimeAgo = (value: string, t: any) => {
  //const { t } = useTranslation();
  const [timeAgo, setTimeAgo] = useState('');
  
  const d = value ? new Date(value.replace(/-/g, '/') + ' GMT+03:00') : new Date();
  const utcTimeNow = new Date();
  const seconds = Math.round(Math.abs((utcTimeNow.getTime() - d.getTime()) / 1000));

  const updateTimeAgo = () => {
      
    if (Number.isNaN(seconds)) {
      setTimeAgo('');
      return;
    }

    let newTimeAgo = '';
    if (seconds <= 45) {
      newTimeAgo = t('a few seconds ago');
    } else if (seconds <= 90) {
      newTimeAgo = t('a minute ago');
      newTimeAgo = seconds+ '';
    } else if (seconds <= 2700) { // 45 minutes
      const minutes = Math.round(seconds / 60);
      newTimeAgo = t('txt_minutes_ago', { value: minutes });
      
    } else if (seconds <= 5400) { // 90 minutes
      newTimeAgo = t('an hour ago');
    } else if (seconds <= 79200) { // 22 hours
      const hours = Math.round(seconds / 3600);
      newTimeAgo = t('txt_hours_ago', { value: hours });
    } else if (seconds <= 129600) { // 36 hours
      newTimeAgo = t('a day ago');
    } else if (seconds <= 2160000) { // 25 days
      const days = Math.round(seconds / 86400);
      newTimeAgo = t('txt_days_ago', { value: days });
    } else if (seconds <= 3888000) { // 45 days
      newTimeAgo = t('a month ago');
    } else if (seconds <= 29894400) { // 345 days
      const months = Math.round(seconds / 2592000);
      newTimeAgo = t('txt_months_ago', { value: months });
    } else if (seconds <= 48624000) { // 545 days
      newTimeAgo = t('a year ago');
    } else {
      const years = Math.round(seconds / 31536000);
      newTimeAgo = t('txt_years_ago', { value: years });
    }

    setTimeAgo(newTimeAgo);
  };

  useEffect(() => {
    
    updateTimeAgo(); // Initial call
    const interval = setInterval(updateTimeAgo, getSecondsUntilUpdate(seconds) * 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [value]);//t

  const getSecondsUntilUpdate = (seconds: number) => {
    const min = 60;
    const hr = min * 60;
    const day = hr * 24;
    if (seconds < min) { // less than 1 min, update every 2 secs
      return 2;
    } else if (seconds < hr) { // less than an hour, update every 30 secs
      return 30;
    } else if (seconds < day) { // less than a day, update every 5 mins
      return 300;
    } else { // update every hour
      return 3600;
    }
  };

  return { timeAgo, setTimeAgo };
};
 
 export const timeSpent = (value: number) => {
    if (!value) {
      return '0 seconds';
    }
  
    let seconds = value;
    let minutes = 0;
    let hours = 0;
    let days = 0;
    let months = 0;
  
    if (seconds > 60) {
      minutes = seconds / 60;
    }
    if (minutes > 60) {
      hours = minutes / 60;
    }
    if (hours > 24) {
      days = hours / 24;
    }
    if (days > 31) {
      months = days / 31;
    }
  
    if (months) {
      return months.toFixed(2) + ' months';
    }
    if (days) {
      return days.toFixed(2) + ' days';
    }
    if (hours) {
      return hours.toFixed(2) + ' hours';
    }
    if (minutes) {
      return minutes.toFixed(2) + ' minutes';
    }
    if (seconds) {
      return seconds.toFixed(2) + ' seconds';
    }
  };
   