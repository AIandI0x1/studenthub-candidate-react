
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckIcon } from "lucide-react";
import React, { useEffect, useId, useState } from "react";
import { FormControl, FormItem, FormLabel, FormMessage } from "../ui/form";
import { filterUniversities } from "@/providers/university.service";
import { langContent } from "@/utils/common";
import { useTranslation } from "react-i18next";

interface NationalityInputProps {
    university_id?: number;
    onSelect: (university: any) => void;
    required?: boolean;
}

export default function NationalityInput({ university_id, onSelect, required = false }: NationalityInputProps) {

    const [selectedUniversity, setSelectedUniversity] = useState(null);

    const [open, setOpen] = React.useState(false)
    const [loading, setLoading] = useState(false);
    const [universityList, setUniversityList] = useState([]);

    useEffect(() => {
        setLoading(true);

        filterUniversities().then((res) => {
            setUniversityList(res.data);

            if (university_id) {
                const university = universityList.find((university: any) => university.university_id == university_id);
                onSelect(university);
                
                if (university)
                    setSelectedUniversity(university);
            }
        }).finally(() => {
            setLoading(false);
        });

    }, [universityList]);

    const handleSelect = (university: any) => {
        onSelect(university);
        setSelectedUniversity(university);
        setOpen(false);
    };

    const id = useId()

    const { t } = useTranslation();
    
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>

                <FormItem className="relative cursor-pointer">
                    <FormControl>

                        <p
                            className={`peer h-[72px] py-[16px] px-[24px] border-gray-300 w-full 
                            border-[color:var(--Neutral-30,#EEEEF0)] rounded-2xl text-[#23233D]
                            placeholder-transparent border
                            
                            ${university_id ? 'pt-[32px]' : ''}
                            `}
                        >
                            {selectedUniversity ?
                                langContent(selectedUniversity['university_name_en'], selectedUniversity['university_name_ar']) : null}
                        </p>

                    </FormControl>
                    <FormLabel
                        htmlFor={id}

                        className={
                            `absolute start-[5px] z-10 bg-white px-4 transition-all duration-200
                            top-1/2 -translate-y-1/2 scale-100
                            text-[color:var(--Neutral-70,#7D7D8D)] text-base font-normal leading-6
                            
                            ${university_id ?
                                                'top-3.5 start-[0px] -translate-y-0 scale-75 text-[color:var(--Neutral-80,#68687A)] font-medium leading-4' : ''} 
                                
                            `}
                    >
                        {t('University')} {required && <span className='text-destructive'>*</span>}
                    </FormLabel>
                    <FormMessage />
                </FormItem>

            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
                <Command>
                    <CommandInput placeholder={t('Search university...')} />
                    <CommandList>
                        <ScrollArea className="h-72">
                            <CommandEmpty>
                                {loading ? t('Loading...') : t('No university found.')}
                            </CommandEmpty>

                            <CommandGroup>
                                {universityList.map((university: any) =>
                                    university ? (

                                        <CommandItem key={university.university_id} className="gap-2 cursor-pointer"
                                            onSelect={() => handleSelect(university)}>
                                            <span className="flex-1 text-sm">{langContent(university.university_name_en, university.university_name_ar)}</span>
                                            <CheckIcon
                                                className={`ml-auto size-4 ${university.university_id == university_id ?
                                                    "opacity-100" : "opacity-0"}`}
                                            />
                                        </CommandItem>

                                    ) : null,
                                )}
                            </CommandGroup>
                        </ScrollArea>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}