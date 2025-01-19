import { useId } from 'react'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { UseFormReturn } from 'react-hook-form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select'
import { useTranslation } from 'react-i18next'
import i18n from '@/18n';


interface FormInputProps {
  name: string,
  label: string,
  form: UseFormReturn,
  options: { key: string; value: string }[],
  helper?: string,
  inputDir?: string,
  onFocus?: () => void, 
  onChange?: (e: any) => void,
}

export function FormSelect({
  name,
  label,
  form, 
  helper,
  options,
  inputDir = i18n.language == "ar"? "rtl": "ltr",
  onFocus, 
  onChange
}: FormInputProps) {
  const id = useId()

  const { t } = useTranslation();

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className="relative ">
          <div className="relative ">
          <FormControl dir={inputDir}>
              
            <Select {...field} onValueChange={(e) => onChange && onChange(e)} >
                <SelectTrigger className={`bg-white peer h-[72px] py-[16px] px-[24px] border-gray-300 w-full 
                    border-[color:var(--Neutral-30,#EEEEF0)] rounded-2xl text-[#23233D]
                    placeholder-transparent focus:ring-1
                    focus:pt-[32px]
                    [&:not(:placeholder-shown)]:pt-[32px]
                    ${fieldState.error 
                    ? 'border-destructive focus:border-destructive focus:ring-destructive' 
                    : 'focus:border-primary focus:ring-primary'}`}>
                    <SelectValue placeholder={label} />
                </SelectTrigger>
                <SelectContent>
                    { options.map(row => <SelectItem value={ row.key }>{ row.value }</SelectItem>) }
                </SelectContent>
            </Select>

          </FormControl>
          <FormLabel 
            htmlFor={id}
            dir={inputDir}
            className={`absolute z-2 bg-white px-[24px] transition-all duration-200
              top-1/2 -translate-y-1/2 scale-100
              text-[color:var(--Neutral-70,#7D7D8D)] text-base font-normal leading-6
              
              ${inputDir == "ltr" ? 'start-[1px] peer-focus:start-[6px] peer-[&:not(:placeholder-shown)]:start-[6px] origin-[0]': 
                'start-[1px] peer-focus:start-[6px] peer-[&:not(:placeholder-shown)]:start-[6px] origin-[100%]'}

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
          <FormDescription dir="ltr" className='mt-[8px]'>
            { helper }
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}