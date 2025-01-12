
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
import { listMajors } from "@/providers/logged-in/candidate-education.service";
import { langContent } from "@/utils/common";
import { useTranslation } from "react-i18next";

interface MajorInputProps {
    major_uuid?: any;
    onSelect: (major: any) => void;
}

export default function MajorInput({ major_uuid, onSelect }: MajorInputProps) {

    const [open, setOpen] = React.useState(false)
    const [loading, setLoading] = useState(false);
    const [majorList, setMajorList] = useState([]);
    const [selectedMajor, setSelectedMajor] = useState(null);

    useEffect(() => {
        setLoading(true);

        listMajors().then((res) => {
            setMajorList(res.data);

            if (major_uuid) {
                const major = majorList.find((major: any) => major.major_uuid == major_uuid);
                onSelect(major);
                
                if (major)
                    setSelectedMajor(major);
            }
        }).finally(() => {
            setLoading(false);
        });

    }, [majorList]);

    const handleSelect = (major: any) => {
        onSelect(major);
        setSelectedMajor(major);
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
                            
                            ${selectedMajor ? 'pt-[32px]' : ''}
                            `}
                        >
                            { selectedMajor ?
                                langContent(selectedMajor['major_name_en'], selectedMajor['major_name_ar']) : null}
                        </p>

                    </FormControl>
                    <FormLabel
                        htmlFor={id}

                        className={
                            `absolute start-[5px] z-10 bg-white px-4 transition-all duration-200
                            top-1/2 -translate-y-1/2 scale-100
                            text-[color:var(--Neutral-70,#7D7D8D)] text-base font-normal leading-6
                            
                            ${selectedMajor ?
                                                'top-3.5 start-[0px] -translate-y-0 scale-75 text-[color:var(--Neutral-80,#68687A)] font-medium leading-4' : ''} 
                                
                            `}
                    >
                        {t('Field of Study')}
                    </FormLabel>
                    <FormMessage />
                </FormItem>

            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
                <Command>
                    <CommandInput placeholder="Search major..." />
                    <CommandList>
                        <ScrollArea className="h-72">
                            <CommandEmpty>
                                {loading ? t('Loading...') : t('No major found.')}
                            </CommandEmpty>

                            <CommandGroup>
                                {majorList.map((major: any) =>
                                    major ? (

                                        <CommandItem key={major.major_uuid} className="gap-2 cursor-pointer"
                                            onSelect={() => handleSelect(major)}>
                                            <span className="flex-1 text-sm">
                                                {langContent(major.major_name_en, major.major_name_ar)}
                                            </span>
                                            <CheckIcon
                                                className={`ml-auto size-4 ${major.major_uuid == major_uuid ?
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