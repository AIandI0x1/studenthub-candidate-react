
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
import { listDegreeGroups } from "@/providers/logged-in/candidate-education.service";
import { useTranslation } from "react-i18next";

interface DegreeGroupInputProps {
    degree_group_uuid?: string;
    onSelect: (degreeGroup: any) => void;
    required?: boolean;
}

export default function DegreeGroupInput({ degree_group_uuid, onSelect, required = false }: DegreeGroupInputProps) {

    const [open, setOpen] = React.useState(false)
    const [loading, setLoading] = useState(false);
    const [degreeGroupList, setDegreeGroupList] = useState([]);
    const [selectedDegreeGroup, setSelectedDegreeGroup] = useState(null);

    const { t } = useTranslation();

    useEffect(() => {
        setLoading(true);

        listDegreeGroups().then((res) => {
            setDegreeGroupList(res.data);

            if (degree_group_uuid) {
                const degreeGroup = degreeGroupList.find((degreeGroup: any) => degreeGroup.degree_group_uuid == degree_group_uuid);
                onSelect(degreeGroup);
                
                if (degreeGroup)
                    setSelectedDegreeGroup(degreeGroup);
            }   
        }).finally(() => {
            setLoading(false);
        });

    }, [degreeGroupList]);

    const handleSelect = (degreeGroup: any) => {
        onSelect(degreeGroup);
        setSelectedDegreeGroup(degreeGroup);
        setOpen(false);
    };

    const id = useId()

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>

                <FormItem className="relative cursor-pointer">
                    <FormControl>

                        <p
                            className={`peer h-[72px] py-[16px] px-[24px] border-gray-300 w-full 
                            border-[color:var(--Neutral-30,#EEEEF0)] rounded-2xl text-[#23233D]
                            placeholder-transparent border
                            
                            ${selectedDegreeGroup ? 'pt-[32px]' : ''}
                            `}
                        >
                            {selectedDegreeGroup ?
                                selectedDegreeGroup['degree_group_name_en'] : null}
                        </p>

                    </FormControl>
                    <FormLabel
                        htmlFor={id}

                        className={
                            `absolute start-[5px] z-10 bg-white px-4 transition-all duration-200
                            top-1/2 -translate-y-1/2 scale-100
                            text-[color:var(--Neutral-70,#7D7D8D)] text-base font-normal leading-6
                            
                            ${selectedDegreeGroup ?
                                                'top-3.5 start-[0px] -translate-y-0 scale-75 text-[color:var(--Neutral-80,#68687A)] font-medium leading-4' : ''} 
                                
                            `}
                    >
                        {t('Degree Group')} {required && <span className='text-destructive'>*</span>}   
                    </FormLabel>
                    <FormMessage />
                </FormItem>

            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
                <Command>
                    <CommandInput placeholder={t('Search Degree Group...')} />
                    <CommandList>
                        <ScrollArea className="h-72">
                            <CommandEmpty>
                                {loading ? t('Loading...') : t('No degree Group found.')}
                            </CommandEmpty>

                            <CommandGroup>
                                {degreeGroupList.map((degreeGroup: any) =>
                                    degreeGroup ? (

                                        <CommandItem key={degreeGroup.degree_group_uuid} className="gap-2 cursor-pointer"
                                            onSelect={() => handleSelect(degreeGroup)}>
                                            <span className="flex-1 text-sm">{degreeGroup.degree_group_name_en}</span>
                                            <CheckIcon
                                                className={`ml-auto size-4 ${degreeGroup.degree_group_uuid == degree_group_uuid ?
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