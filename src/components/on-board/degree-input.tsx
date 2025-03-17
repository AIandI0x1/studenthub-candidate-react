
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
import { listDegrees } from "@/providers/logged-in/candidate-education.service";
import { langContent } from "@/utils/common";
import { useTranslation } from "react-i18next";

interface DegreeInputProps {
    degree_uuid?: string;
    selectedDegreeGroup?: any;
    onSelect: (degree: any) => void;
    required?: boolean;
}

export default function DegreeInput({ degree_uuid, selectedDegreeGroup, onSelect, required = false }: DegreeInputProps) {

    const [open, setOpen] = React.useState(false)
    const [loading, setLoading] = useState(false);
    const [degreeList, setDegreeList] = useState([]);
    const [selectedDegree, setSelectedDegree] = useState(null);

    useEffect(() => {
        setLoading(true);

        listDegrees(-1, `&degree_group_uuid=${selectedDegreeGroup?.degree_group_uuid}`).then((res) => {
            setDegreeList(res.data);

            if (degree_uuid) {
                const degree = degreeList.find((degree: any) => degree.degree_uuid == degree_uuid);
                onSelect(degree);
                
                if (degree)
                    setSelectedDegree(degree);
            }
        }).finally(() => {
            setLoading(false);
        });

    }, [degreeList]);

    const handleSelect = (degree: any) => {
        onSelect(degree);
        setSelectedDegree(degree);
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
                            
                            ${selectedDegree ? 'pt-[32px]' : ''}
                            `}
                        >
                            {selectedDegree ?
                                selectedDegree['degree_name_en'] : null}
                        </p>

                    </FormControl>
                    <FormLabel
                        htmlFor={id}

                        className={
                            `absolute start-[5px] z-10 bg-white px-4 transition-all duration-200
                            top-1/2 -translate-y-1/2 scale-100
                            text-[color:var(--Neutral-70,#7D7D8D)] text-base font-normal leading-6
                            
                            ${selectedDegree ?
                                                'top-3.5 start-[0px] -translate-y-0 scale-75 text-[color:var(--Neutral-80,#68687A)] font-medium leading-4' : ''} 
                                
                            `}
                    >
                        {t('Degree')} {required && <span className='text-destructive'>*</span>}
                    </FormLabel>
                    <FormMessage />
                </FormItem>

            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
                <Command>
                    <CommandInput placeholder={t('Search degree...')} />
                    <CommandList>
                        <ScrollArea className="h-72">
                            <CommandEmpty>
                                {loading ? t('Loading...') : t('No degree found.')}
                            </CommandEmpty>

                            <CommandGroup>
                                {degreeList.map((degree: any) =>
                                    degree ? (

                                        <CommandItem key={degree.degree_uuid} className="gap-2 cursor-pointer"
                                            onSelect={() => handleSelect(degree)}>
                                            <span className="flex-1 text-sm">
                                                {langContent(degree.degree_name_en, degree.degree_name_ar)}
                                            </span>
                                            <CheckIcon
                                                className={`ml-auto size-4 ${degree.degree_uuid == degree_uuid ?
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