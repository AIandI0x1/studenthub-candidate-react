import { Input } from "@/components/ui/input"
import { FormControl, FormItem, FormLabel, FormMessage } from './form'
import { ControllerRenderProps, FieldValues } from "react-hook-form"
import { useTranslation } from "react-i18next"


interface FloatingLabelInputProps {
  label: string,
  field?: ControllerRenderProps<FieldValues, string>
}

/**
 * 
 * @param param0 peer-[&:not(:placeholder-shown)]:-translate-y-3 
      peer-[&:not(:placeholder-shown)]:text-xs
 * @returns 
 */

export default function FloatingLabelInput({ label, field}: FloatingLabelInputProps) {

  const { t } = useTranslation();
  
  return (
    <FormItem className='peer relative flex flex-col items-start self-stretch border border-[color:var(--Neutral-30,#EEEEF0)] [background:var(--Neutral-0,#FFF)] rounded-2xl border-solid'>
      <FormLabel className="absolute start-5 top-6 text-base font-normal leading-6 text-[color:var(--Neutral-70,#7D7D8D)] transition-all duration-200 
      peer-focus-visible:top-10 peer-focus:top-10 
      peer-focus-visible:-translate-y-10 peer-focus-visible:text-xs 
      peer-focus:-translate-y-10 peer-focus:text-xs 
      ">
        {t(label)}
      </FormLabel>
      <FormControl className='peer block m-0 border-none h-[72px] px-[20px] py-[24px]'>
        <Input 
          placeholder=" "  
          {...field}
          className="peer block mt-[32px] mb-0 h-[24px] border-none focus:ring-0 focus-visible:ring-0"
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )
}