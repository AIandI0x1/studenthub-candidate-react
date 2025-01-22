import { useId, useState } from 'react'
import { Input } from "@/components/ui/input"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { UseFormReturn } from 'react-hook-form'
import CircularTimePicker from '@/components/ui/circular-time-picker';
import { useTranslation } from 'react-i18next'
import i18n from '@/18n';

interface FormInputProps {
  name: string,
  label: string,
  form: UseFormReturn,
  helper?: string,
  inputDir?: string,
  onFocus?: () => void,
  autoComplete?: string
}

//todo: show CircularTimePicker on click on icon + mask input to accept only time 

export function FormTimeInput({
  name,
  label,
  form,
  helper,
  inputDir = i18n.language == "ar"? "rtl": "ltr",
  onFocus,
  autoComplete = "off"
}: FormInputProps) {
  const id = useId()

  const [isTimerOpen, setIsTimerOpen] = useState<boolean>(false);

  const { t } = useTranslation();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className="relative">
          <div className="relative tappable cursor-pointer" onClick={() => setIsTimerOpen(true)}>

          <div className='absolute end-4 top-[22px]'>
            <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="4.89258" width="16" height="16" rx="8" stroke="#7D7D8D" strokeWidth="2"/>
              <path d="M11 9.89258V12.2351C11 12.5581 11.156 12.8611 11.4188 13.0488L14 14.8926" stroke="#7D7D8D" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>

          <FormControl>
            <Input
                dir={inputDir}
                {...field}
                id={id}
               // type='time'
               readOnly
                /*onInput={(e) => {
                  const input = e.target as HTMLInputElement;
                  let value = input.value.toUpperCase();
                  value = value.replace(/[^0-9APM:]/g, '');
                  if (value.length === 2 || value.length === 5) {
                    value += ':';
                  }
                  if (value.length === 8) {
                    value = value.slice(0, 8);
                  }
                  input.value = value;
                }}*/
                placeholder="HH:MM PM"  // Empty space needed for peer styling
                onFocus={onFocus}
                autoComplete={autoComplete}
                className={`bg-white peer h-[72px] py-[16px] px-[24px] border-gray-300 w-full 
                    border-[color:var(--Neutral-30,#EEEEF0)] rounded-2xl text-[#23233D]
                    placeholder-transparent focus:ring-1
                     placeholder-white
                    focus:pt-[32px]
                    [&:not(:placeholder-shown)]:pt-[32px]
                    ${fieldState.error 
                        ? 'border-destructive focus:border-destructive focus:ring-destructive' 
                        : 'focus:border-primary focus:ring-primary'}`}
            />
           
          </FormControl>
          <FormLabel 
            htmlFor={id}
            dir={inputDir}
            className={`absolute z-2 bg-white px-[24px] transition-all duration-200
              top-1/2 -translate-y-1/2 scale-100
              text-[color:var(--Neutral-70,#7D7D8D)] text-base font-normal leading-6
              
              ${inputDir == "ltr"? 'start-[1px] peer-focus:start-[6px] peer-[&:not(:placeholder-shown)]:start-[6px] origin-[0]': 'start-[1px] peer-focus:start-[6px] peer-[&:not(:placeholder-shown)]:start-[6px] origin-[100%]'}

              peer-focus:top-3.5 
              
              peer-focus:-translate-y-0 peer-focus:scale-75
              peer-focus:text-[color:var(--Neutral-80,#68687A)] 
              peer-focus:font-medium 
              peer-focus:leading-4
              
              peer-[&:not(:placeholder-shown)]:top-3.5 
              peer-[&:not(:placeholder-shown)]:-translate-y-0
              peer-[&:not(:placeholder-shown)]:scale-75
              peer-[&:not(:placeholder-shown)]:text-[color:var(--Neutral-80,#68687A)] 
              peer-[&:not(:placeholder-shown)]:font-medium 
              peer-[&:not(:placeholder-shown)]:leading-4

              ${fieldState.error ? 'text-destructive' : 'text-gray-500 peer-focus:text-primary'}`}
          >
            {t(label)}
          </FormLabel>
          </div>

          { isTimerOpen && <CircularTimePicker onClose={() => setIsTimerOpen(false)} onChange={(value: string) => {
            form.setValue(name, value);
            form.trigger(name);
          }} /> }

          <FormDescription dir="ltr" className='mt-[8px]'>
            { helper }
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}