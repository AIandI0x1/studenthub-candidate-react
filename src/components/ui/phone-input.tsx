import { CheckIcon, ChevronsUpDown } from "lucide-react";

import * as React from "react";

import * as RPNInput from "react-phone-number-input";

import flags from "react-phone-number-input/flags";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { cn } from "@/lib/utils";
import { ScrollArea } from "./scroll-area";
import { FormControl, FormLabel } from "./form";
import { useTranslation } from "react-i18next";

type PhoneInputProps = Omit<
  React.ComponentProps<"input">,
  "onChange" | "value" | "ref"
> &
  Omit<RPNInput.Props<typeof RPNInput.default>, "onChange"> & {
    onChange?: (value: RPNInput.Value) => void;
  };
 
const PhoneInput: React.ForwardRefExoticComponent<PhoneInputProps> =
  React.forwardRef<React.ElementRef<typeof RPNInput.default>, PhoneInputProps>(
    ({ className, onChange, ...props }, ref) => {
 

      return (
        <RPNInput.default
          ref={ref}
          className={cn("flex", className)}
          flagComponent={FlagComponent}
          countrySelectComponent={CountrySelect}
          inputComponent={InputComponent}
          smartCaret={false}
          /**
           * Handles the onChange event.
           *
           * react-phone-number-input might trigger the onChange event as undefined
           * when a valid phone number is not entered. To prevent this,
           * the value is coerced to an empty string.
           *
           * @param {E164Number | undefined} value - The entered value
           */
          onChange={(value) => onChange?.(value || ("" as RPNInput.Value))}
          {...props}
        />
      );
    },
  );
PhoneInput.displayName = "PhoneInput";

const InputComponent = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, ...props }, ref) => {
    

      //${fieldState.error 
      //? 'border-destructive focus:border-destructive focus:ring-destructive' 
      //: 'focus:border-primary focus:ring-primary'}
  
      //${fieldState.error ? 'text-destructive' : 'text-gray-500 peer-focus:text-primary'}
    
      const { t, i18n } = useTranslation();

      return (
      <>
  
      <FormControl className="relative w-full">
          <Input
              placeholder=" "  // Empty space needed for peer styling
              className={`peer h-[72px] py-[16px] px-[24px] border-gray-300 w-full 
                  border-[color:var(--Neutral-30,#EEEEF0)] rounded-2xl text-[#23233D]
                  placeholder-transparent focus:ring-1
                  focus:pt-[32px]
                  [&:not(:placeholder-shown)]:pt-[32px]
                  ${i18n.language != 'ar' ? 'rounded-e-lg rounded-s-none' : 'rounded-e-none rounded-s-lg'}
                  ${cn("", className)}
  
                  `}
              {...props}
              ref={ref}
              />
      </FormControl>
      <FormLabel
                      
              className={`absolute start-[82px] z-10 bg-white px-4 transition-all duration-200
              top-1/2 -translate-y-1/2 scale-100
              text-[color:var(--Neutral-70,#7D7D8D)] text-base font-normal leading-6
              
              
              peer-focus:top-3.5 
              peer-focus:start-[63px] 
              peer-focus:-translate-y-0 peer-focus:scale-75
              peer-focus:text-[color:var(--Neutral-80,#68687A)] 
              peer-focus:font-medium 
              peer-focus:leading-4
              
              peer-[&:not(:placeholder-shown)]:top-3.5 
              peer-[&:not(:placeholder-shown)]:start-[63px]
              peer-[&:not(:placeholder-shown)]:-translate-y-0
              peer-[&:not(:placeholder-shown)]:scale-75
              peer-[&:not(:placeholder-shown)]:text-[color:var(--Neutral-80,#68687A)] 
              peer-[&:not(:placeholder-shown)]:font-medium 
              peer-[&:not(:placeholder-shown)]:leading-4
  
              `}
          >
          {t("Your phone number")}
      </FormLabel>
  
      </>
      );
  });

InputComponent.displayName = "InputComponent";

type CountryEntry = { label: string; value: RPNInput.Country | undefined };

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  options: CountryEntry[];
  onChange: (country: RPNInput.Country) => void;
};

const CountrySelect = ({
  disabled,
  value: selectedCountry,
  options: countryList,
  onChange,
}: CountrySelectProps) => {

    if (!selectedCountry) {
        selectedCountry = "KW"
    }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          
          className="[background:var(--Neutral-20,#F5F5F7)] flex gap-1 h-[72px] w-[82px] rounded-e-none rounded-s-lg px-3 border-e-0 focus:z-10"
          disabled={disabled}
        >
          <FlagComponent
            country={selectedCountry}
            countryName={selectedCountry}
          />
          <ChevronsUpDown
            className={cn(
              "-me-2 size-4 opacity-50",
              disabled ? "hidden" : "opacity-100",
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search country..." />
          <CommandList>
            <ScrollArea className="h-72">
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {countryList.map(({ value, label }) =>
                  value ? (
                    <CountrySelectOption
                      key={value}
                      country={value}
                      countryName={label}
                      selectedCountry={selectedCountry}
                      onChange={onChange}
                    />
                  ) : null,
                )}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

interface CountrySelectOptionProps extends RPNInput.FlagProps {
  selectedCountry: RPNInput.Country;
  onChange: (country: RPNInput.Country) => void;
}

const CountrySelectOption = ({
  country,
  countryName,
  selectedCountry,
  onChange,
}: CountrySelectOptionProps) => {
  return (
 
    <CommandItem className="gap-2" onSelect={() => onChange(country)}>
      <FlagComponent country={country} countryName={countryName} />
      <span className="flex-1 text-sm">{countryName}</span>
      <span className="text-foreground/50 text-sm">{`+${RPNInput.getCountryCallingCode(country)}`}</span>
      <CheckIcon
        className={`ms-auto size-4 ${country === selectedCountry ? 
            "opacity-100" : "opacity-0"}`}
      />
    </CommandItem>
  );
};

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country];
//bg-foreground/20 
  return (
    <span className="[&_svg]:size-[24px] flex h-[24px] w-[24px] overflow-hidden rounded-sm">
      {Flag && <Flag title={countryName} />}
    </span>
  );
};

export { PhoneInput };