import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination"
  
import { CheckIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { FormInput } from "../ui/form-input";
import { Card, CardContent } from "../ui/card";
import { listMajors } from "@/providers/logged-in/candidate-education.service";
import { langContent } from "@/utils/common";

interface NationalityInputProps {
    selectedMajor: any | null;
    onSelect: (major: any) => void;
    name: string;
    custom_major: string;
    form: any;
    required?: boolean;
}

export default function PagedMajorInput({ selectedMajor, onSelect, name, custom_major, form, required = false }: NationalityInputProps) {

    const [open, setOpen] = React.useState(false);
    const [loading, setLoading] = useState(false);
    const [majorList, setMajorList] = useState([]);
    const [showCustomInput, setShowCustomInput] = useState(false);

    const [pagination, setPagination] = useState({
        current_page: 1,
        total_pages: 1,
        total_count: 0,
    });
    
    useEffect(() => {
        if(form.getValues(custom_major)){
            handleSelect("other");
        }
    }, [form]);

    useEffect(() => {
         
        if (open || form.getValues(name) != "") {
            loadPage(1)
        }

    }, [form.watch(name)])
 
    const handleSelect = (major: any) => {
        setOpen(false);
        
        if (major === 'other') {
            setShowCustomInput(true);
            onSelect({other: true});
        } else {
            setShowCustomInput(false);
            onSelect(major);
            setMajorList([]);
        }
    };
 
    const onFocus = () => {
        setOpen(true)
       // onSelect(null); 
    }

    const loadPage = (page: number) => {
          
        if ((page > 1 && page > pagination.total_pages) || page < 1) {
            return;
        }

        setLoading(true);
        const searchTerm = form.getValues(name) == "Other" ? "" : form.getValues(name)   
 
        listMajors(page, "&limit=5&q=" + searchTerm).then((res) => {
            setMajorList(res.data);

            setPagination({
                current_page: parseInt(res.headers.get('x-pagination-current-page') || '1'),
                total_pages: parseInt(res.headers.get('x-pagination-page-count') || '1'),
                total_count: parseInt(res.headers.get('x-pagination-total-count') || '0'),
            });

        }).finally(() => {
            setLoading(false);
        });
    }

    return (
        <div>
            <div className="relative">
                
                    <FormInput
                        onFocus={() => onFocus()}
                        name={name}
                        label={ form.getValues(name) == "" ? "Search Field of Study" : "Field of Study"}
                        form={form as any}    
                        autoComplete="off"
                        required={required}
                        ></FormInput>
                    
                    { /** absolute */}
                        
                    { open ? (
                        
                        <Card className="absolute bg-white top-full start-0 w-full mt-2
                        border-[color:var(--Neutral-30,#EEEEF0)] rounded-2xl text-[#23233D]
                        border-gray-300 overflow-hidden z-[999999999]
                            ">
                            <CardContent className="pt-2 bg-white z-100">
                        <ul className="bg-white">
                            {/* Other option */}
                            <li 
                                key="other" 
                                className="gap-2 cursor-pointer p-2 hover:bg-gray-100 flex items-center"
                                onClick={() => handleSelect('other')}
                            >
                                <span className="flex-1 text-sm">Other</span>
                                <CheckIcon
                                    className={`ml-auto size-4 ${selectedMajor?.other === true ? "opacity-100" : "opacity-0"}`}
                                />
                            </li>
                            
                            {/* Divider */}
                            <li className="border-t border-gray-200 my-1"></li>
                            
                            {/* Major list */}
                            {majorList.map((major: any) =>
                                major ? (
                                    <li 
                                        key={major.major_uuid} 
                                        className="gap-2 cursor-pointer p-2 hover:bg-gray-100 flex items-center"
                                        onClick={() => handleSelect(major)}
                                    >
                                        <span className="flex-1 text-sm">{langContent(major.major_name_en, major.major_name_ar)}</span>
                                        <CheckIcon
                                            className={`ml-auto size-4 ${major.major_uuid === selectedMajor?.major_uuid ? "opacity-100" : "opacity-0"}`}
                                        />
                                    </li>
                                ) : null
                            )} 
                        </ul>

                    { /* pagination.total_pages > 1 && (
                        <Pagination>
                            <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious 
                                    className="cursor-pointer"
                                    onClick={() => loadPage(pagination.current_page - 1)} />
                            </PaginationItem>

                            {/*Math.min(pagination.total_pages, 2)*

                            {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map((page) => (
                                <PaginationItem key={page}>
                                    <PaginationLink 
                                        className="cursor-pointer"
                                        onClick={() => loadPage(page)}
                                        isActive={page === pagination.current_page}
                                    >
                                        {page}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}
                            
                            {/*
                                pagination.total_pages > 2 && (
                                    <PaginationEllipsis />
                                )
                            *

                            <PaginationItem>
                                <PaginationNext 
                                    className="cursor-pointer"
                                    onClick={() => loadPage(pagination.current_page + 1)} />
                            </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    )  
                    */}
                    </CardContent>
                    </Card>
                    ) : null
                    }

            </div> 
             {/* Custom input for Other */}
             {showCustomInput && (
                            <div className="mt-2">
                                <FormInput
                                    name={custom_major}
                                    label="Specify Field of Study"
                                    form={form}
                                    autoComplete="off"
                                    required={selectedMajor?.major_uuid == null}
                                />
                            </div>
                        )}
        </div>
    )
}