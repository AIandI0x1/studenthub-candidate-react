import React, { useState } from 'react';
import { Button } from './button';
import { useTranslation } from 'react-i18next';

//todo: on open show current time as selected and on close return current time 

const CircularTimePicker: React.FC<{ onChange: (time: string) => void, onClose: () => void }> = 
({ onChange, onClose }) => {
  const [hour, setHour] = useState<number>(1);
  const [minute, setMinute] = useState<number>(0);
  const [isAM, setIsAM] = useState<boolean>(true);
  const [mode, setMode] = useState<string>("hour")

  const { t } = useTranslation();

  const handleHourChange = (newHour: number) => {
    setHour(newHour);
    notifyChange(newHour, minute, isAM);
    setMode('minutes');
  };

  const handleMinuteChange = (newMinute: number) => {
    setMinute(newMinute);
    notifyChange(hour, newMinute, isAM);
  };

  const toggleAMPM = () => {
    setIsAM(!isAM);
    notifyChange(hour, minute, !isAM);
  };

  const notifyChange = (hour: number, minute: number, am: boolean) => {
    const time = `${hour}:${minute < 10 ? `0${minute}` : minute} ${am ? 'AM' : 'PM'}`;
    onChange(time);
  };
 
  return (
    <div className="xs:top-[0px] sm:top-[65px] absolute z-10 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-76">
        <div className="text-xl text-center mb-4">
        <Button type='button' className={ `me-2 text-[#4c6ff2] ${mode== 'hour'? ' bg-gray-200' : ''}` } variant="ghost" onClick={() => setMode("hour")}> {hour} </Button>:
        <Button type='button' className={ `mx-2 text-[#4c6ff2] ${mode== 'minutes'? ' bg-gray-200' : ''}` } variant="ghost" onClick={() => setMode("minutes")}>{minute < 10 ? `0${minute}` : minute} </Button>
        <Button type='button' variant="ghost" onClick={() => toggleAMPM()}>
            <span className={ isAM? 'text-[#4c6ff2]' : 'text-gray-300' }>AM</span>/
            <span className={ !isAM? 'text-[#4c6ff2]' : 'text-gray-300' }>PM</span>
        </Button>
        </div>
        <div className="relative w-48 h-48 mx-auto mb-4">
        
        { mode == "hour" && [...Array(12)].map((_, index) => {
            const angle = (index / 12) * 360 - 60;

            const hourPosition = {
            top: `${41 + 40 * Math.sin((angle * Math.PI) / 180)}%`,
            left: `${41 + 40 * Math.cos((angle * Math.PI) / 180)}%`,
            };
            return (
            <div
                key={index}
                className="absolute w-8 h-8 flex items-center justify-center rounded-full bg-blue-200 cursor-pointer"
                style={hourPosition}
                onClick={() => handleHourChange(index + 1)}
            >
                {index + 1}
            </div>
            );
        })}
        
        { mode == "minutes" && [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 
            50, 55
        ].map((value, index) => {
            const angle = (index / 12) * 360 - 90;
            const hourPosition = {
            top: `${41 + 40 * Math.sin((angle * Math.PI) / 180)}%`,
            left: `${41 + 40 * Math.cos((angle * Math.PI) / 180)}%`,
            };
            return (
            <div
                key={value}
                className="absolute w-8 h-8 flex items-center justify-center rounded-full bg-blue-200 cursor-pointer"
                style={hourPosition}
                onClick={() => handleMinuteChange(value)}
            >
                {value}
            </div>
            );
        })}



        </div>

        {/*<div className="flex justify-around mb-4">
        {[0, 15, 30, 45].map((min) => (
            <div
            key={min}
            className="cursor-pointer border border-gray-300 rounded-md px-2 py-1"
            onClick={() => handleMinuteChange(min)}
            >
            {min < 10 ? `0${min}` : min}
            </div>
        ))}
        </div>

        <div className="text-center mb-4">
        <button
            onClick={toggleAMPM}
            className="px-4 py-2 bg-gray-200 rounded-md"
        >
            {isAM ? 'Switch to PM' : 'Switch to AM'}
        </button>
        </div>*/}
        <div className="flex justify-between">
        <Button variant="ghost" type='button'
            onClick={onClose}
            className="px-4 py-2"
        >
            {t("Cancel")}
        </Button>
        <Button type='button'
            onClick={onClose}
            className="px-4 py-2"
        >
            {t("Okay")}
        </Button>
        </div>
    </div>
  );
};

export default CircularTimePicker;