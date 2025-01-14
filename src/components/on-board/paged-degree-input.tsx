import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination"
  
import { CheckIcon } from "lucide-react";
import React, { useEffect, useId, useState } from "react";
import { listDegrees } from "@/providers/logged-in/candidate-education.service";
import { FormInput } from "../ui/form-input";
import { Card, CardContent } from "../ui/card";
import { langContent } from "@/utils/common";

interface DegreeInputProps {
    selectedDegree: any | null;
    onSelect: (degree: any) => void;
    name: string;
    form: any;
}

export default function PagedDegreeInput({ selectedDegree, onSelect, name, form }: DegreeInputProps) {

    const [open, setOpen] = React.useState(false)
    const [loading, setLoading] = useState(false);
    const [degreeList, setDegreeList] = useState([]);

    const [pagination, setPagination] = useState({
        current_page: 1,
        total_pages: 1,
    });

    useEffect(() => {
         
        if (!open || form.getValues(name) == "") {
            return;
        }

        loadPage(1)

    }, [form.watch(name)])
 
    const handleSelect = (degree: any) => {
        setOpen(false)
        onSelect(degree); 
        setDegreeList([]);        
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
 
        listDegrees(page, "&q=" + form.getValues(name)).then((res: any) => {
            setDegreeList(res.data);

            setPagination({
                current_page: parseInt(res.headers.get('x-pagination-current-page') || '1'),
                total_pages: parseInt(res.headers.get('x-pagination-page-count') || '1'),
            });

        }).finally(() => {
            setLoading(false);
        });
    }

    return (
        <div className="relative">
             
                <FormInput
                    onFocus={() => onFocus()}
                    name={name}
                    label="Degree"
                    form={form as any}    
                    autoComplete="off"
                    ></FormInput>
                 
                 { /** absolute */}
                    
                { degreeList.length > 0 ? (
                    
                    <Card className="absolute bg-white top-full start-0 w-full mt-2
                    border-[color:var(--Neutral-30,#EEEEF0)] rounded-2xl text-[#23233D]
                    border-gray-300 overflow-hidden z-[999999999]
                        ">
                        <CardContent className="pt-2 bg-white z-100">
                    <ul className="bg-white">
                        {degreeList.map((degree: any) =>
                    degree ? (

                        <li key={degree.degree_uuid} className="gap-2 cursor-pointer"
                            onClick={() => handleSelect(degree)}>
                            <span className="flex-1 text-sm">
                                {langContent(degree.degree_name_en, degree.degree_name_ar)}
                            </span>
                            <CheckIcon
                                className={`ml-auto size-4 ${degree.degree_uuid == selectedDegree?.degree_uuid ?
                                    "opacity-100" : "opacity-0"}`}
                            />
                        </li>

                    ) : null,
                    )} 
                </ul>

                { pagination.total_pages > 1 && (
                    <Pagination>
                        <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious 
                                className="cursor-pointer"
                                onClick={() => loadPage(pagination.current_page - 1)} />
                        </PaginationItem>

{/**Math.min(pagination.total_pages, 2) */}
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
                         */}

                        <PaginationItem>
                            <PaginationNext 
                                className="cursor-pointer"
                                onClick={() => loadPage(pagination.current_page + 1)} />
                        </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                )  
                }
                </CardContent>
                </Card>
                ) : null
                }

        </div> 
    )
}